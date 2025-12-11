from pyramid.view import view_config, view_defaults
from .models import DBSession, Patient
import transaction

# Class-Based View (Memenuhi Syarat OOP)
@view_defaults(route_name='patients', renderer='json')
class PatientViews:
    def __init__(self, request):
        self.request = request

    # GET /api/patients
    @view_config(request_method='GET')
    def get_list(self):
        # Query ke database pakai DBSession
        patients = DBSession.query(Patient).all()
        return [p.to_json() for p in patients]

    # POST /api/patients
    @view_config(request_method='POST')
    def create(self):
        data = self.request.json_body
        
        # Validasi Sederhana
        if not data.get('name'):
            self.request.response.status = 400
            return {'error': 'Nama Pasien Wajib!'}

        # Tambah ke DB
        new_patient = Patient(
            name=data['name'],
            age=data.get('age', 0),
            diagnosis=data.get('diagnosis', '-')
        )
        DBSession.add(new_patient)
        # Tidak perlu commit manual, pyramid_tm yang urus
        
        return {'status': 'success', 'msg': 'Data tersimpan'}