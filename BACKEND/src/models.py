from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey, Enum, func
)
from sqlalchemy.orm import relationship, declarative_base, scoped_session, sessionmaker
from zope.sqlalchemy import register
import datetime

# Setup Session
DBSession = scoped_session(sessionmaker())
register(DBSession)
Base = declarative_base()

# MODEL USER
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(Text, nullable=False) # Akan berisi Hash, bukan password asli
    role = Column(String(20), nullable=False) # 'patient' atau 'doctor'
    created_at = Column(DateTime, default=func.now())

    # RELASI: Satu User (jika dokter) punya satu Doctor Profile
    # uselist=False artinya One-to-One
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role
        }

# MODEL DOCTOR (Sesuai SQL tabel doctors)
class Doctor(Base):
    __tablename__ = 'doctors'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    specialization = Column(String(100), nullable=False)
    schedule = Column(Text)
    created_at = Column(DateTime, default=func.now())

    # RELASI BALIK: Agar Doctor bisa akses data User induknya
    user = relationship("User", back_populates="doctor_profile")

    def to_json(self):
        return {
            "id": self.id, # ID Dokter
            "user_id": self.user_id,
            "specialization": self.specialization,
            "schedule": self.schedule,
            "name": self.user.name # Kita bisa ambil nama dari tabel user lewat relasi
        }