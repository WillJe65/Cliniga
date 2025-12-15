from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Date,
    Time,
    DateTime,
    ForeignKey,
    CheckConstraint,
    func
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker, scoped_session
from zope.sqlalchemy import register

# =======================================================
# 1. SETUP KONEKSI KHUSUS PYRAMID (PENTING!)
# =======================================================
# Kita tidak menaruh URL database disini (hardcode), 
# tapi biarkan __init__.py yang mengaturnya lewat .env / .ini

# Membuat 'DBSession' yang dicari-cari oleh __init__.py
# Ini adalah "Magic Session" yang otomatis diatur oleh Pyramid
DBSession = scoped_session(sessionmaker())
register(DBSession)

Base = declarative_base()

# =======================================================
# 2. MODELS (Kode Anda Sudah Benar, Saya Pertahankan)
# =======================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(Text, nullable=False)
    role = Column(String(20), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relasi
    doctor = relationship("Doctor", back_populates="user", uselist=False)
    my_appointments = relationship("Appointment", back_populates="patient")

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    specialization = Column(String(100), nullable=False)
    schedule = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    # Relasi
    user = relationship("User", back_populates="doctor")
    appointments = relationship("Appointment", back_populates="doctor")

    def to_json(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "specialization": self.specialization,
            "schedule": self.schedule,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(Time, nullable=False)
    status = Column(String(20), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        CheckConstraint(
            "status IN ('pending', 'confirmed', 'completed', 'cancelled')",
            name="appointment_status_check"
        ),
    )

    # Relasi
    patient = relationship("User", back_populates="my_appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    medical_record = relationship("MedicalRecord", back_populates="appointment", uselist=False)

    def to_json(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "doctor_id": self.doctor_id,
            "appointment_date": str(self.appointment_date), # Pakai str() lebih aman untuk Date object
            "appointment_time": str(self.appointment_time), # Pakai str() lebih aman untuk Time object
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), unique=True, nullable=False)
    diagnosis = Column(Text, nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    # Relasi
    appointment = relationship("Appointment", back_populates="medical_record")

    def to_json(self):
        return {
            "id": self.id,
            "appointment_id": self.appointment_id,
            "diagnosis": self.diagnosis,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }