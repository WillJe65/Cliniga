from pyramid.view import view_config, view_defaults
from ..models import DBSession, User, Doctor, Appointment as AppointmentModel 
from datetime import datetime, date, time
import transaction

@view_defaults(renderer='json')
class AppointmentViews:  # <--- GANTI NAMA CLASS
    def __init__(self, request):
        self.request = request
    
    # ---------------------------------------------------------
    # BUAT APPOINTMENT BARU
    # ---------------------------------------------------------
    @view_config(route_name='create-appointment', request_method='POST')
    def create_appointment(self):
        data = self.request.json_body
        
        required_fields = ['patient_id', 'doctor_id', 'appointment_date', 'appointment_time']
        if not all(k in data for k in required_fields):
            self.request.response.status = 400
            return {'error': 'Data tidak lengkap. Wajib: patient_id, doctor_id, appointment_date, appointment_time'}
        
        try:
            # KONVERSI DATA: String (JSON) -> Python Object
            # "2025-12-25" -> date(2025, 12, 25)
            date_obj = datetime.strptime(data['appointment_date'], '%Y-%m-%d').date()
            # "14:30" -> time(14, 30)
            time_obj = datetime.strptime(data['appointment_time'], '%H:%M').time()

            # VALIDASI LOGIKA: Tidak boleh booking tanggal masa lalu
            now = datetime.now()
            if date_obj < date.today() or (date_obj == date.today() and time_obj <= now.time()):
                self.request.response.status = 400
                return {'error': 'Tanggal dan waktu janji temu harus di masa depan'}
            
            # SIMPAN KE DB
            # Gunakan 'AppointmentModel' (nama alias yang kita buat di import)
            new_appointment = AppointmentModel(
                patient_id=data['patient_id'],
                doctor_id=data['doctor_id'],
                appointment_date=date_obj,
                appointment_time=time_obj,
                status='pending'
            )
            
            DBSession.add(new_appointment)
            # transaction.commit() <-- Tidak perlu manual commit jika pakai pyramid_tm
            DBSession.flush() # Flush agar kita bisa dapat ID-nya
            
            return {'status': 'success', 'message': 'Janji temu berhasil dibuat', 'appointment_id': new_appointment.id}
            
        except ValueError:
            self.request.response.status = 400
            return {'error': 'Format tanggal/jam salah. Gunakan YYYY-MM-DD dan HH:MM'}
        except Exception as e:
            self.request.response.status = 500
            return {'error': 'Gagal membuat janji temu', 'details': str(e)}
    
    # ---------------------------------------------------------
    # EDIT APPOINTMENT
    # ---------------------------------------------------------
    @view_config(route_name="edit-appointment", request_method='PUT')
    def edit_appointment(self):
        data = self.request.json_body
        appointment_id = data.get('appointment_id')
        
        if not appointment_id:
            self.request.response.status = 400
            return {'error': 'appointment_id wajib disertakan'}
        
        # Cari data
        appointment = DBSession.query(AppointmentModel).filter(AppointmentModel.id == appointment_id).first()
        if not appointment:
            self.request.response.status = 404
            return {'error': 'Janji temu tidak ditemukan'}
        
        try:
            # Update Date jika ada
            if 'appointment_date' in data:
                appointment.appointment_date = datetime.strptime(data['appointment_date'], '%Y-%m-%d').date()
            
            # Update Time jika ada
            if 'appointment_time' in data:
                appointment.appointment_time = datetime.strptime(data['appointment_time'], '%H:%M').time()
            
            # Update Status
            if 'status' in data:
                new_status = data['status']
                
                # Validasi Status
                if new_status not in ['pending', 'confirmed', 'completed', 'cancelled']:
                    self.request.response.status = 400
                    return {'error': 'Status tidak valid'}
                
                # Perbaikan Syntax 'else if' -> 'elif'
                elif new_status == 'completed':
                    # Logika opsional, tergantung apakah dokter boleh manual complete atau tidak
                    # Jika ingin membolehkan dokter mengubah jadi complete, hapus blok elif ini
                    self.request.response.status = 400
                    return {'error': 'Status completed hanya dapat diatur oleh sistem/dokter setelah selesai'}
                
                elif new_status == 'cancelled' and appointment.status == 'completed':
                    self.request.response.status = 400
                    return {'error': 'Janji temu yang sudah completed tidak dapat dibatalkan'}
                
                appointment.status = new_status
            return {'status': 'success', 'message': 'Janji temu berhasil diupdate'}

        except ValueError:
             self.request.response.status = 400
             return {'error': 'Format tanggal/jam salah'}

    # ---------------------------------------------------------
    # SHOW ALL APPOINTMENTS
    # ---------------------------------------------------------
    @view_config(route_name="show-appointments", request_method='GET')
    def show_appointments(self):
        appointments = DBSession.query(AppointmentModel).all()
        result = []
        for appt in appointments:
            result.append({
                'id': appt.id,
                'patient_id': appt.patient_id,
                'doctor_id': appt.doctor_id,
                'appointment_date': str(appt.appointment_date),
                'appointment_time': str(appt.appointment_time),
                'status': appt.status 
            })
        return {'appointments': result}
    
    # ---------------------------------------------------------
    # FILTER APPOINTMENTS
    # ---------------------------------------------------------
    @view_config(route_name="filter-appointments", request_method='GET')
    def filter_appointments(self):
        request_params = self.request.params
        doctor_id = request_params.get('doctor_id')
        patient_id = request_params.get('patient_id')
        status = request_params.get('status')
        
        query = DBSession.query(AppointmentModel)
        
        #  Try-Except untuk user kirim id berupa huruf
        try:
            if doctor_id:
                query = query.filter(AppointmentModel.doctor_id == int(doctor_id))
            if patient_id:
                query = query.filter(AppointmentModel.patient_id == int(patient_id))
            if status:
                query = query.filter(AppointmentModel.status == status)
            
            appointments = query.all()
            result = []
            for appt in appointments:
                result.append({
                    'id': appt.id,
                    'patient_id': appt.patient_id,
                    'doctor_id': appt.doctor_id,
                    'appointment_date': str(appt.appointment_date),
                    'appointment_time': str(appt.appointment_time),
                    'status': appt.status
                })
            return {'appointments': result}
            
        except ValueError:
            self.request.response.status = 400
            return {'error': 'ID harus berupa angka'}