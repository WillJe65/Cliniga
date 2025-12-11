from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from .models import DBSession, Base

def main(global_config, **settings):
    # Koneksi Database dari file .ini
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    
    # perlu Buat tabel kalau belum ada (tanpa migrasi)
    # Base.metadata.create_all(engine)

    # 2. Setup Pyramid
    with Configurator(settings=settings) as config:
        config.include('pyramid_tm') # Transaction Manager
        
        # Bagian Routing API
        config.add_route('patients', '/api/patients')
        
        # 4. Scan folder views(agar diaktifkan)
        config.scan('.views')

    return config.make_wsgi_app()