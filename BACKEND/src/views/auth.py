from pyramid.view import view_config, view_defaults
from ..models import DBSession, User, Doctor 
import bcrypt
import transaction
import os 
import jwt
import datetime

@view_defaults(renderer='json')
class AuthViews:
    def __init__(self, request):
        self.request = request

    # =======================================================
    # REGISTER
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
            self.request.response.status = 409 
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
            DBSession.flush() 

            # 5. Handle Dokter
            if data['role'] == 'doctor':
                if 'specialization' not in data:
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

        user = DBSession.query(User).filter(User.email == email).first()

        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            
            # Secret Key
            secret_key = os.getenv("JWT")
            if not secret_key:
                print("CRITICAL: JWT belum ada di .env")
                

            # 2. Tentukan Kapan Token Expire (Misal: 24 Jam dari sekarang)
            expiration_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)

            # 3. Siapkan Isi Tiket (Payload)
            payload = {
                'sub': user.id,          # Subject (ID User)
                'name': user.name,       # Info tambahan (opsional)
                'role': user.role,       # Info role (penting buat frontend)
                'exp': expiration_time,  # Kapan tiket hangus
                'iat': datetime.datetime.now(datetime.timezone.utc) # Kapan tiket dibuat (Issued At)
            }

            # 4. GENERATE TOKEN (Encode)
            token_string = jwt.encode(payload, secret_key, algorithm='HS256')

            # 5. Response ke Frontend
            user_data = {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }

            response_data = {
                'status': 'success',
                'user': user_data,
                'token': token_string
            }

            # Tambahan Data Dokter
            if user.role == 'doctor' and user.doctor:
                response_data['doctor_profile'] = {
                    'specialization': user.doctor.specialization,
                    'schedule': user.doctor.schedule
                }

            return response_data
        
        else:
            self.request.response.status = 401
            return {'error': 'Email atau Password Salah'}