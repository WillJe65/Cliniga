from pyramid.view import view_config, view_defaults
from ..models import DBSession, Doctor, User

@view_defaults(renderer='json')
class DoctorViews:
    def __init__(self, request):
        self.request = request

    # Endpoint: /api/doctors
    @view_config(route_name='get_doctors', request_method='GET')
    def get_doctors(self):
        doctors = DBSession.query(Doctor).join(User).all()
        
        results = []
        for doc in doctors:
            results.append({
                "id": doc.id,             # ID Dokter 
                "name": doc.user.name,    # Nama 
                "specialization": doc.specialization,
                "schedule": doc.schedule
            })
        
        return results