from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from .models import DBSession, Base
from dotenv import load_dotenv

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
        config.include('pyramid_tm')
        
        # Route Auth
        config.add_route('register', '/api/auth/register')
        config.add_route('login', '/api/auth/login')
        
        config.scan('.views')
    return config.make_wsgi_app()