from pyramid.view import view_config, view_defaults
from ..models import DBSession, User, Doctor 
import bcrypt
import transaction
import os 

@view_defaults(renderer='json')
class AuthViews:
    def __init__(self, request):
        self.request = request

    # =======================================================
    # REGISTER (DAFTAR AKUN)
    # =======================================================
    @view_config(route_name='register', request_method='POST')
    def register(self):
        data = self.request.json_body
        
        # Validasi Input Dasar
        required_fields = ['name', 'email', 'password', 'role']
        if not all(k in data for k in required_fields):
            self.request.response.status = 400
            return {'error': 'Data tidak lengkap. Wajib: name, email, password, role'}

        # Cek apakah Email sudah terpakai (Query SQLAlchemy)
        email_input = data['email']
        existing_user = DBSession.query(User).filter(User.email == email_input).first()
        
        if existing_user:
            self.request.response.status = 409
            return {'error': 'Email sudah terpakai'}
        
        # Hash Password (Keamanan)
        hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

        try:
            # Buat User Baru (Masuk ke Tabel 'users')
            new_user = User(
                name=data['name'],
                email=data['email'],
                password=hashed_pw.decode('utf-8'), # Simpan string hash
                role=data['role'] 
            )
            DBSession.add(new_user)
            
            # PENTING: flush() agar new_user.id terbentuk (auto increment)
            # tanpa perlu commit permanen dulu (masih bisa di-rollback kalau error)
            DBSession.flush() 

            # 5. Logika Khusus DOKTER (Masuk ke Tabel 'doctors')
            if data['role'] == 'doctor':
                # Cek field khusus dokter
                if 'specialization' not in data:
                    # Batalkan semua proses (User user tidak jadi dibuat)
                    transaction.abort() 
                    self.request.response.status = 400
                    return {'error': 'Role dokter wajib mengisi specialization!'}
                
                new_doctor = Doctor(
                    user_id=new_user.id, # Ambil ID dari user yang baru dibuat di atas
                    specialization=data['specialization'],
                    schedule=data.get('schedule', '-') # Default strip jika kosong
                )
                DBSession.add(new_doctor)

            # Jika sampai sini sukses, transaction manager akan auto-commit
            return {'status': 'success', 'msg': f'User {data["role"]} berhasil dibuat'}
        
        except Exception as e:
            # Jika ada error database atau server
            self.request.response.status = 500
            print(f"ERROR REGISTER: {e}") # Cek terminal untuk detail error
            return {'error': 'Terjadi kesalahan internal server'}

    # =======================================================
    # LOGIN (MASUK)
    # =======================================================
    @view_config(route_name='login', request_method='POST')
    def login(self):
        data = self.request.json_body
        email = data.get('email')
        password = data.get('password')

        # Cari User berdasarkan Email
        user = DBSession.query(User).filter(User.email == email).first()

        # Validasi Password
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            
            # Ambil Secret Key dari .env
            secret_key = os.getenv("JWT_SECRET")
            
            if not secret_key:
                print("PERINGATAN: JWT_SECRET belum diset di file .env!")
                # Fallback darurat (opsional, sebaiknya error di production)
                secret_key = "secretkode"

            #  Data User untuk Response
            user_data = {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }

            response_data = {
                'status': 'success',
                'user': user_data,
                # CATATAN PENTING:
                # Idealnya disini kita generate JWT Token pakai library 'PyJWT'.
                # Tapi untuk sementara, kita kirim string placeholder/secret agar React tidak error.
                'token': f"mock-token-for-{user.id}" 
            }

            # Jika Dokter, lampirkan data spesialisasi
            # Cek relasi doctor_profile dari models.py
            if user.role == 'doctor' and user.doctor_profile:
                response_data['doctor_profile'] = {
                    'specialization': user.doctor_profile.specialization,
                    'schedule': user.doctor_profile.schedule
                }

            return response_data
        
        else:
            # Gagal Login
            self.request.response.status = 401
            return {'error': 'Email atau Password Salah'}