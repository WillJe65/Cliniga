from pyramid.view import view_config, view_defaults
from ..models import DBSession, User, Doctor
import bcrypt
import transaction

@view_defaults(route_name='auth', renderer='json')
class AuthViews:
    def __init__(self, request):
        self.request = request

    # REGISTER AKUN
    @view_config(route_name='register', request_method='POST')
    def register(self):
        data = self.request.json_body
        
        # 1. Validasi Input 
        if not all(k in data for k in ('name', 'email', 'password', 'role')):
            self.request.response.status = 400
            return {'error': 'Data tidak lengkap (name, email, password, role)'}

        # Hash Password
        hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

        try:
            #Buat User Baru 
            new_user = User(
                name=data['name'],
                email=data['email'],
                password=hashed_pw.decode('utf-8'),
                role=data['role'] # 'patient' atau 'doctor'
            )
            DBSession.add(new_user)
            DBSession.flush() # Flush agar new_user.id terbentuk 

            # LOGIKA KHUSUS DOKTER
            # Jika role-nya dokter, WAJIB isi tabel doctors juga
            if data['role'] == 'doctor':
                if 'specialization' not in data:
                    # Rollback jika data dokter kurang
                    transaction.abort() 
                    self.request.response.status = 400
                    return {'error': 'Dokter wajib mengisi specialization!'}
                
                new_doctor = Doctor(
                    user_id=new_user.id, # Ambil ID dari user yang baru dibuat
                    specialization=data['specialization'],
                    schedule=data.get('schedule', '-')
                )
                DBSession.add(new_doctor)

            return {'status': 'success', 'msg': f'User {data["role"]} berhasil dibuat'}
        
        except Exception as e:
            self.request.response.status = 500
            return {'error': str(e)}

    # LOGIN
    @view_config(route_name='login', request_method='POST')
    def login(self):
        data = self.request.json_body
        email = data.get('email')
        password = data.get('password')

        # Cari User berdasarkan Email
        user = DBSession.query(User).filter(User.email == email).first()

        # Cek Password
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            
            # MENYUSUN DATA RESPON
            response_data = {
                'status': 'success',
                'user': user.to_json(),
                'token': os.getenv("JWT") # Nanti diganti JWT
            }

            # JIKA DOKTER, LAMPIRKAN DATA PROFILNYA
            #  butuh Doctor ID untuk fitur dokter, bukan cuma User ID
            if user.role == 'doctor' and user.doctor_profile:
                response_data['doctor_profile'] = user.doctor_profile.to_json()

            return response_data
        
        else:
            self.request.response.status = 401
            return {'error': 'Email atau Password Salah'}