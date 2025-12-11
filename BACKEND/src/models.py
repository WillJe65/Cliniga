from sqlalchemy import Column, Integer, String, Text, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session
from zope.sqlalchemy import register

# Setup Session Manager (Agar Thread-Safe)
DBSession = scoped_session(sessionmaker())
register(DBSession)

Base = declarative_base()

#  MODEL PASIEN
#masih dummy 
class Patient(Base):
    __tablename__ = 'patients'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer)
    diagnosis = Column(Text)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "diagnosis": self.diagnosis
        }
    

class Doctor(Base):
    __tablename__ = 'Doctors'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer)
    diagnosis = Column(Text)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "diagnosis": self.diagnosis
        }