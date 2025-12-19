from pyramid.view import view_config, view_defaults
from ..models import DBSession, MedicalRecord, Appointment
import transaction

@view_defaults(renderer='json')
class MedicalRecordViews:
    def __init__(self, request):
        self.request = request

    # =======================================================
    # 1. LIHAT REKAM MEDIS (KHUSUS PASIEN)
    # =======================================================
    @view_config(route_name='get_medical_record', request_method='GET')
    def get_medical_record(self):
        appointment_id = self.request.params.get('appointment_id')
        
        if not appointment_id:
            self.request.response.status = 400
            return {'error': 'appointment_id wajib disertakan'}

        # Cari data rekam medis berdasarkan ID janji temu
        record = DBSession.query(MedicalRecord).filter(MedicalRecord.appointment_id == appointment_id).first()

        if not record:
            self.request.response.status = 404
            return {'error': 'Belum ada rekam medis untuk janji temu ini (Dokter belum mengisi)'}

        # Return data sesuai request: id, appointment_id, diagnosis, notes
        return {
            'status': 'success',
            'data': {
                'id': record.id,
                'appointment_id': record.appointment_id,
                'diagnosis': record.diagnosis,
                'notes': record.notes,
                'created_at': str(record.created_at)
            }
        }

    # =======================================================
    # 2. RIWAYAT KESEHATAN LENGKAP (OPSIONAL)
    # =======================================================
    @view_config(route_name='get_patient_history', request_method='GET')
    def get_patient_history(self):
        patient_id = self.request.params.get('patient_id')
        
        if not patient_id:
            self.request.response.status = 400
            return {'error': 'patient_id wajib disertakan'}
        
        # Join tabel Appointment untuk filter berdasarkan patient_id
        records = DBSession.query(MedicalRecord)\
            .join(Appointment, MedicalRecord.appointment_id == Appointment.id)\
            .filter(Appointment.patient_id == patient_id)\
            .all()
            
        result = []
        for r in records:
            result.append({
                'id': r.id,
                'appointment_id': r.appointment_id,
                'appointment_date': str(r.appointment.appointment_date), # Info tambahan tanggal
                'diagnosis': r.diagnosis,
                'notes': r.notes
            })
            
        return {'status': 'success', 'data': result}

    # =======================================================
    # 3. BUAT REKAM MEDIS (KHUSUS DOKTER)
    # =======================================================
    @view_config(route_name='create_medical_record', request_method='POST')
    def create_medical_record(self):
        data = self.request.json_body
        
        # Validasi input
        if not all(k in data for k in ['appointment_id', 'diagnosis']):
            self.request.response.status = 400
            return {'error': 'appointment_id dan diagnosis wajib diisi'}

        # Cek apakah appointment ada?
        appt = DBSession.query(Appointment).filter(Appointment.id == data['appointment_id']).first()
        if not appt:
            self.request.response.status = 404
            return {'error': 'Appointment tidak ditemukan'}

        # Cek apakah sudah pernah diisi? (Mencegah duplikasi)
        existing_record = DBSession.query(MedicalRecord).filter(MedicalRecord.appointment_id == data['appointment_id']).first()
        if existing_record:
            self.request.response.status = 409
            return {'error': 'Rekam medis untuk appointment ini sudah ada. Gunakan fitur edit.'}

        try:
            new_record = MedicalRecord(
                appointment_id=data['appointment_id'],
                diagnosis=data['diagnosis'],
                notes=data.get('notes', '-') # Opsional
            )
            DBSession.add(new_record)
            
            # Update status appointment jadi 'completed' otomatis
            appt.status = 'completed'
            
            DBSession.flush()
            return {'status': 'success', 'message': 'Rekam medis berhasil dibuat', 'id': new_record.id}
            
        except Exception as e:
            self.request.response.status = 500
            return {'error': 'Gagal menyimpan data', 'details': str(e)}