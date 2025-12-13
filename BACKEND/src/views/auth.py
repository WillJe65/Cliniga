from pyramid.view import view_config, view_defaults
from ..models import DBSession, User, Doctor 
import bcrypt
import transaction
import os 

@view_defaults(route_name='auth', renderer='json')
class AuthViews:
    def __init__(self, request):
        self.request = request

    # --- REGISTER AKUN ---
    @view_config(route_name='register', request_method='POST')
    def register(self):
        data = self.request.json_body
        
        # Validasi Input Dasar
        if not all(k in data for k in ('name', 'email', 'password', 'role')):
            self.request.response.status = 400
            return {'error': 'Data tidak lengkap (name, email, password, role)'}

        # --- PERBAIKAN 1: Query Cek Email ---
        email_input = data['email']
        # Gunakan 'User' (Huruf besar/Class Model), bukan 'users'
        existing_user = DBSession.query(User).filter(User.email == email_input).first()
        
        if existing_user:
            self.request.response.status = 409
            return {'error': 'Email sudah terpakai'}
        
        # Hash Password
        hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

        try:
            # Buat User Baru 
            new_user = User(
                name=data['name'],
                email=data['email'],
                password=hashed_pw.decode('utf-8'), # Simpan sebagai string
                role=data['role'] 
            )
            DBSession.add(new_user)
            DBSession.flush() # Penting: Agar new_user.id terbentuk sebelum dipakai di bawah

            # --- LOGIKA KHUSUS DOKTER ---
            if data['role'] == 'doctor':
                # Validasi tambahan untuk dokter
                if 'specialization' not in data:
                    # Rollback (Batalkan semua, user tidak jadi dibuat)
                    # Catatan: Di Pyramid modern pakai zope.sqlalchemy mark_changed, 
                    # tapi transaction.abort() manual juga bisa untuk logic ini.
                    transaction.abort() 
                    self.request.response.status = 400
                    return {'error': 'Dokter wajib mengisi specialization!'}
                
                new_doctor = Doctor(
                    user_id=new_user.id, # Link ke ID user yang baru dibuat
                    specialization=data['specialization'],
                    schedule=data.get('schedule', '-')
                )
                DBSession.add(new_doctor)

            return {'status': 'success', 'msg': f'User {data["role"]} berhasil dibuat'}
        
        except Exception as e:
            self.request.response.status = 500
            # Print error ke terminal server biar gampang debug
            print(f"Error Register: {e}") 
            return {'error': 'Terjadi kesalahan server'}

    # --- LOGIN ---
    @view_config(route_name='login', request_method='POST')
    def login(self):
        data = self.request.json_body
        email = data.get('email')
        password = data.get('password')

        # Cari User
        user = DBSession.query(User).filter(User.email == email).first()

        # Cek Password
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            
            # Jika user belum punya method to_json, buat manual dictionary:
            user_data = {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }

            response_data = {
                'status': 'success',
                'user': user_data, 
                # Pastikan ada default value jika env variable kosong
                'token': os.getenv("JWT_SECRET", "default_secret_dev") 
            }

            # Cek Relasi Dokter
            # Pastikan di models.py User punya relasi: doctor_profile = relationship("Doctor", uselist=False, back_populates="user")
            if user.role == 'doctor' and hasattr(user, 'doctor_profile') and user.doctor_profile:
                response_data['doctor_profile'] = {
                    'specialization': user.doctor_profile.specialization,
                    'schedule': user.doctor_profile.schedule
                }

            return response_data
        
        else:
            self.request.response.status = 401
            return {'error': 'Email atau Password Salah'}