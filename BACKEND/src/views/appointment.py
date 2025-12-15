from pyramid.view import view_config, view_defaults
from ..models import DBSession, User, Doctor, Appointment as AppointmentModel 
from datetime import datetime, date, time
import transaction

@view_defaults(renderer='json')
class AppointmentViews:
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
            # Konversi String -> Object
            date_obj = datetime.strptime(data['appointment_date'], '%Y-%m-%d').date()
            time_obj = datetime.strptime(data['appointment_time'], '%H:%M').time()

            # Validasi Waktu (Tidak boleh masa lalu)
            now = datetime.now()
            if date_obj < date.today() or (date_obj == date.today() and time_obj <= now.time()):
                self.request.response.status = 400
                return {'error': 'Tanggal dan waktu janji temu harus di masa depan'}
            
            # Simpan ke DB dengan status awal 'pending'
            new_appointment = AppointmentModel(
                patient_id=data['patient_id'],
                doctor_id=data['doctor_id'],
                appointment_date=date_obj,
                appointment_time=time_obj,
                status='pending' # Default status
            )
            
            DBSession.add(new_appointment)
            DBSession.flush() 
            
            return {
                'status': 'success', 
                'message': 'Janji temu berhasil dibuat', 
                'appointment_id': new_appointment.id
            }
            
        except ValueError:
            self.request.response.status = 400
            return {'error': 'Format tanggal/jam salah. Gunakan YYYY-MM-DD dan HH:MM'}
        except Exception as e:
            self.request.response.status = 500
            return {'error': 'Gagal membuat janji temu', 'details': str(e)}
    
    # ---------------------------------------------------------
    # EDIT APPOINTMENT (Dokter Terima/Tolak)
    # ---------------------------------------------------------
    @view_config(route_name="edit-appointment", request_method='PUT')
    def edit_appointment(self):
        data = self.request.json_body
        appointment_id = data.get('appointment_id')
        
        if not appointment_id:
            self.request.response.status = 400
            return {'error': 'appointment_id wajib disertakan'}
        
        # Cari data appointment
        appointment = DBSession.query(AppointmentModel).filter(AppointmentModel.id == appointment_id).first()
        if not appointment:
            self.request.response.status = 404
            return {'error': 'Janji temu tidak ditemukan'}
        
        try:
            # Update Tanggal/Jam (Reschedule)
            if 'appointment_date' in data:
                appointment.appointment_date = datetime.strptime(data['appointment_date'], '%Y-%m-%d').date()
            if 'appointment_time' in data:
                appointment.appointment_time = datetime.strptime(data['appointment_time'], '%H:%M').time()
            
            # Update Status (Logika Terima/Tolak Dokter)
            if 'status' in data:
                new_status = data['status']
                current_status = appointment.status
                
                valid_statuses = ['pending', 'confirmed', 'completed', 'cancelled']
                
                # Validasi Input Status
                if new_status not in valid_statuses:
                    self.request.response.status = 400
                    return {'error': f'Status tidak valid. Pilihan: {valid_statuses}'}

                # Logika Transisi Status (State Machine)
                
                # Dokter MENERIMA (Pending -> Confirmed)
                if new_status == 'confirmed':
                    if current_status != 'pending':
                        self.request.response.status = 400
                        return {'error': 'Hanya janji temu "pending" yang bisa dikonfirmasi'}
                
                # Dokter MENOLAK / Membatalkan (Pending/Confirmed -> Cancelled)
                elif new_status == 'cancelled':
                    if current_status == 'completed':
                        self.request.response.status = 400
                        return {'error': 'Janji temu yang sudah selesai tidak bisa dibatalkan'}
                    
                # Skenario: Dokter Menyelesaikan Tugas (Confirmed -> Completed)
                elif new_status == 'completed':
                    if current_status != 'confirmed':
                        self.request.response.status = 400
                        return {'error': 'Hanya janji temu yang sudah dikonfirmasi yang bisa diselesaikan'}

                # Terapkan perubahan status
                appointment.status = new_status
            
            return {
                'status': 'success', 
                'message': f'Janji temu berhasil diupdate menjadi {appointment.status}',
                'data': {
                    'id': appointment.id,
                    'status': appointment.status,
                    'date': str(appointment.appointment_date),
                    'time': str(appointment.appointment_time)
                }
            }

        except ValueError:
             self.request.response.status = 400
             return {'error': 'Format tanggal/jam salah'}

    # ---------------------------------------------------------
    # SHOW ALL APPOINTMENTS
    # ---------------------------------------------------------
    @view_config(route_name="show-appointments", request_method='GET')
    def show_appointments(self):
        appointments = DBSession.query(AppointmentModel).all()
        return {'appointments': [self._serialize(appt) for appt in appointments]}
    
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
        
        try:
            if doctor_id:
                query = query.filter(AppointmentModel.doctor_id == int(doctor_id))
            if patient_id:
                query = query.filter(AppointmentModel.patient_id == int(patient_id))
            if status:
                query = query.filter(AppointmentModel.status == status)
            
            appointments = query.all()
            return {'appointments': [self._serialize(appt) for appt in appointments]}
            
        except ValueError:
            self.request.response.status = 400
            return {'error': 'ID harus berupa angka'}

    # Helper function untuk merapikan kode
    def _serialize(self, appt):
        return {
            'id': appt.id,
            'patient_id': appt.patient_id,
            'doctor_id': appt.doctor_id,
            'appointment_date': str(appt.appointment_date),
            'appointment_time': str(appt.appointment_time),
            'status': appt.status
        }