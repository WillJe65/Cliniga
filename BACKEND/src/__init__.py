from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from .models import DBSession, Base
from dotenv import load_dotenv
from pyramid.events import NewRequest
import os

# --- [MULAI KODE CORS MANUAL] ---
def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
        'Access-Control-Allow-Origin': '*',  # Izinkan React mengakses
        'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '1728000',
        })
    event.request.add_response_callback(cors_headers)
# --- [AKHIR KODE CORS MANUAL] ---


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
        # Tambahkan CORS headers ke setiap response
        config.add_subscriber(add_cors_headers_response_callback, NewRequest)
        
        config.include('pyramid_tm')
        
        # Routing API
        config.add_route('register', '/api/register')
        config.add_route('login', '/api/login')
        config.add_route('create-appointment', '/api/appointments/create-appointment')
        config.add_route('edit-appointment', '/api/appointments/edit-appointment')
        config.add_route('delete-appointment', '/api/appointments/delete-appointment')
        config.add_route('show-appointments', '/api/appointments/show-appointments')
        config.add_route('filter-appointments', '/api/appointments/filter-appointments')
        
        config.scan('.views')
    return config.make_wsgi_app()