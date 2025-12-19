from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from .models import DBSession, Base
from dotenv import load_dotenv
from pyramid.events import NewRequest
import os
from pyramid.response import Response

# --- [1. FUNGSI CORS MANUAL] ---
def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        # Daftar Domain yang Diizinkan
        allowed_origins = [
            'https://cliniga.web.id',
            'https://www.cliniga.web.id',
            'http://localhost:5173',  # Untuk dev local
        ]
        
        origin = request.headers.get('Origin')

        # Header Dasar
        response.headers.update({
            'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '1728000',
        })

        # Cek Whitelist
        if origin in allowed_origins:
            response.headers['Access-Control-Allow-Origin'] = origin

    event.request.add_response_callback(cors_headers)

# --- [2. VIEW OPTIONS (PREFLIGHT)] ---
def options_view(request):
    return Response(status=200)


def main(global_config, **settings):

    load_dotenv()

    # env database
    db_user = os.getenv("DB_USER")
    db_pass = os.getenv("DB_PASSWORD")
    db_host = os.getenv("DB_HOST")
    db_name = os.getenv("DB_NAME")

    # Format: postgresql://user:pass@host:port/dbname
    db_url = f"postgresql://{db_user}:{db_pass}@{db_host}:5432/{db_name}"

    # Masukkan ke setting pyramid agar SQLAlchemy tahu
    settings['sqlalchemy.url'] = db_url

    # Koneksi Database dari file .ini
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    # Base.metadata.create_all(engine)

    # Setup Pyramid
    with Configurator(settings=settings) as config:
       # --- SETUP CORS ---
        config.add_subscriber(add_cors_headers_response_callback, NewRequest)
        
        # --- ROUTE KHUSUS OPTIONS (PREFLIGHT) ---
        # Pastikan dua baris ini ada dan urutannya seperti ini:
        config.add_route('cors-options', '/api/*path', request_method='OPTIONS')
        config.add_view(options_view, route_name='cors-options')
        
        config.include('pyramid_tm')
        
        # ==========================================
        # 1. Routing AUTH
        # ==========================================
        config.add_route('register', '/api/auth/register')
        config.add_route('login', '/api/auth/login')

        # ==========================================
        # 2. Routing APPOINTMENTS
        # ==========================================
        config.add_route('create-appointment', '/api/appointments/create')
        config.add_route('edit-appointment', '/api/appointments/edit')
        config.add_route('delete-appointment', '/api/appointments/delete')
        config.add_route('show-appointments', '/api/appointments/show')
        config.add_route('filter-appointments', '/api/appointments/filter')
        
        # ==========================================
        # 3. Routing ACCOUNTS (Profil & Setting)
        # ==========================================
        # Profil & Jadwal Dokter
        config.add_route('account_profile', '/api/account/profile') 
        # Ubah Password
        config.add_route('account_change_password', '/api/account/change-password')
        # Ubah Jadwal (Khusus Dokter)
        config.add_route('account_update_schedule', '/api/account/update-schedule')
        # Logout
        config.add_route('account_logout', '/api/logout')

        # ==========================================
        # 4. Routing MEDICAL RECORDS
        # ==========================================
        # Create (Dokter mengisi hasil periksa)
        config.add_route('create_medical_record', '/api/medical-records/create')
        # Get Detail (Pasien melihat hasil 1 appointment tertentu)
        config.add_route('get_medical_record', '/api/medical-records/detail')
        # Get History (Pasien melihat semua riwayat sakitnya)
        config.add_route('get_patient_history', '/api/medical-records/history')
        

        #==========================================
        # 5. Routing DOCTORS (Daftar Dokter & Spesialisasi)
        #==========================================
        config.add_route('get_doctors', '/api/doctors')
        # Scan folder views untuk mendaftarkan endpoint
        config.scan('.views')

    return config.make_wsgi_app()