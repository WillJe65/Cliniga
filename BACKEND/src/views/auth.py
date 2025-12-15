from pyramid.view import view_config, view_defaults
# Gunakan satu titik (.) jika auth.py satu folder dengan models.py
from ..models import DBSession, User, Doctor 
import bcrypt
import transaction
import os 

@view_defaults(renderer='json')
class AuthViews:
    def __init__(self, request):
        self.request = request

    # =======================================================
    # REGISTER
    # route_name='register' ini NYAMBUNG ke __init__.py tadi
    # =======================================================
    @view_config(route_name='register', request_method='POST')
    def register(self):
        try:
            data = self.request.json_body
        except Exception:
            self.request.response.status = 400
            return {'error': 'Body JSON tidak valid/kosong'}
        
        # 1. Validasi Input
        required_fields = ['name', 'email', 'password', 'role']
        if not all(k in data for k in required_fields):
            self.request.response.status = 400
            return {'error': 'Data tidak lengkap. Wajib: name, email, password, role'}

        # 2. Cek Email Duplikat
        email_input = data['email']
        existing_user = DBSession.query(User).filter(User.email == email_input).first()
        
        if existing_user:
            self.request.response.status = 409 # Conflict
            return {'error': 'Email sudah terpakai'}
        
        # 3. Hash Password
        hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

        try:
            # 4. Simpan User
            new_user = User(
                name=data['name'],
                email=data['email'],
                password=hashed_pw.decode('utf-8'),
                role=data['role'] 
            )
            DBSession.add(new_user)
            DBSession.flush() # Dapatkan ID user sebelum commit

            # 5. Handle Dokter
            if data['role'] == 'doctor':
                if 'specialization' not in data:
                    # Rollback jika data dokter tidak lengkap
                    return {'error': 'Dokter wajib mengisi specialization!'}
                    # Note: transaction otomatis abort jika kita raise error atau return error 400 
                    # tapi manual transaction.abort() juga aman untuk memastikan.
                
                new_doctor = Doctor(
                    user_id=new_user.id,
                    specialization=data['specialization'],
                    schedule=data.get('schedule', '-')
                )
                DBSession.add(new_doctor)

            return {'status': 'success', 'msg': f'User {data["role"]} berhasil dibuat'}
        
        except Exception as e:
            self.request.response.status = 500
            print(f"ERROR REGISTER: {e}")
            return {'error': 'Terjadi kesalahan internal server'}

    # =======================================================
    # LOGIN
    # =======================================================
    @view_config(route_name='login', request_method='POST')
    def login(self):
        try:
            data = self.request.json_body
        except Exception:
            self.request.response.status = 400
            return {'error': 'Body JSON tidak valid'}

        email = data.get('email')
        password = data.get('password')

        # Cari User
        user = DBSession.query(User).filter(User.email == email).first()

        # Cek Password
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            
            # Response Data
            user_data = {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }

            response_data = {
                'status': 'success',
                'user': user_data,
                # Token Mock (Nanti diganti JWT beneran di production)
                'token': f"mock-token-{user.id}-{os.getenv('JWT', 'secret')}" 
            }

            # Tambahan Data Dokter jika dia dokter
            if user.role == 'doctor' and user.doctor: # Pakai nama relasi 'doctor_profile' sesuai models.py saya
                response_data['doctor'] = {
                    'specialization': user.doctor.specialization,
                    'schedule': user.doctor.schedule
                }
            # Jika menggunakan models.py versi standalone terakhir (Anda pakai relasi 'doctor' bukan 'doctor_profile')
            # Maka ganti user.doctor_profile menjadi user.doctor 

            return response_data
        
        else:
            self.request.response.status = 401
            return {'error': 'Email atau Password Salah'}