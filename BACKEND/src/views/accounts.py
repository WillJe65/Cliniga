from pyramid.view import view_config, view_defaults
from ..models import DBSession, User, Doctor
import bcrypt
import transaction

@view_defaults(renderer='json')
class AccountViews:
    def __init__(self, request):
        self.request = request

    # =======================================================
    # 1. LIHAT INFORMASI PEMILIK AKUN & JADWAL (PROFILE)
    # =======================================================
    # Cocok untuk:
    # - Pasien: Menu "Informasi pemilik akun"
    # - Dokter: Menu "Informasi pemilik akun" DAN "Jadwal praktik resmi"
    @view_config(route_name='account_profile', request_method='GET')
    def get_profile(self):
        # Karena belum ada Middleware JWT, kita ambil user_id dari Query Params
        # Contoh request: GET /api/account/profile?user_id=1
        user_id = self.request.params.get('user_id')

        if not user_id:
            self.request.response.status = 400
            return {'error': 'Parameter user_id wajib disertakan'}

        user = DBSession.query(User).filter(User.id == int(user_id)).first()

        if not user:
            self.request.response.status = 404
            return {'error': 'User tidak ditemukan'}

        # Data dasar (Milik Pasien & Dokter)
        profile_data = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'created_at': str(user.created_at)
        }

        # Jika Dokter, tambahkan data spesialisasi & jadwal
        if user.role == 'doctor' and user.doctor:
            profile_data['doctor_info'] = {
                'doctor_id': user.doctor.id,
                'specialization': user.doctor.specialization,
                'schedule': user.doctor.schedule  # <--- "Jadwal praktik resmi"
            }

        return {'status': 'success', 'data': profile_data}

    # =======================================================
    # 2. UBAH KATA SANDI (SETTING)
    # =======================================================
    # Cocok untuk: Pasien & Dokter (Menu "Ubah katasandi")
    @view_config(route_name='account_change_password', request_method='PUT')
    def change_password(self):
        data = self.request.json_body
        user_id = data.get('user_id')
        old_password = data.get('old_password')
        new_password = data.get('new_password')

        if not all([user_id, old_password, new_password]):
            self.request.response.status = 400
            return {'error': 'Mohon isi user_id, password lama, dan password baru'}

        user = DBSession.query(User).filter(User.id == user_id).first()

        if not user:
            self.request.response.status = 404
            return {'error': 'User tidak ditemukan'}

        # Verifikasi Password Lama
        if not bcrypt.checkpw(old_password.encode('utf-8'), user.password.encode('utf-8')):
            self.request.response.status = 401
            return {'error': 'Password lama salah'}

        # Hash Password Baru
        hashed_new_pw = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        
        try:
            user.password = hashed_new_pw.decode('utf-8')
            # DBSession.flush() # Opsional, transaction manager akan handle commit
            return {'status': 'success', 'message': 'Password berhasil diubah'}
        except Exception as e:
            self.request.response.status = 500
            return {'error': 'Gagal mengubah password', 'details': str(e)}

    # =======================================================
    # 3. UBAH JADWAL PRAKTIK (SETTING DOKTER)
    # =======================================================
    # Cocok untuk: Dokter Saja (Menu "Ubah jadwal praktik resmi")
    @view_config(route_name='account_update_schedule', request_method='PUT')
    def update_schedule(self):
        data = self.request.json_body
        user_id = data.get('user_id')
        new_schedule = data.get('schedule') # String teks bebas, misal: "Senin-Jumat, 09.00 - 15.00"

        if not user_id or not new_schedule:
            self.request.response.status = 400
            return {'error': 'user_id dan schedule baru wajib diisi'}

        # Cari user dan pastikan dia dokter
        user = DBSession.query(User).filter(User.id == user_id).first()

        if not user:
            self.request.response.status = 404
            return {'error': 'User tidak ditemukan'}
        
        if user.role != 'doctor':
            self.request.response.status = 403 # Forbidden
            return {'error': 'Akses ditolak. Fitur ini hanya untuk Dokter.'}
        
        # Update Jadwal di tabel Doctors
        # Akses via relationship 'user.doctor'
        if user.doctor:
            user.doctor.schedule = new_schedule
            return {'status': 'success', 'message': 'Jadwal praktik berhasil diperbarui', 'schedule': new_schedule}
        else:
            self.request.response.status = 404
            return {'error': 'Data profil dokter belum lengkap'}

    # =======================================================
    # 4. LOGOUT
    # =======================================================
    # Cocok untuk: Pasien & Dokter
    # Catatan: Karena JWT-nya masih "mock" (stateless), logout sebenarnya cukup 
    # dilakukan di React (hapus localStorage). Namun endpoint ini disiapkan 
    # jika nanti ingin menerapkan blacklist token atau session server-side.
    @view_config(route_name='account_logout', request_method='POST')
    def logout(self):
        # Di masa depan: Masukkan token ke blacklist Redis/DB
        return {'status': 'success', 'message': 'Logout berhasil. Silakan hapus token di sisi Client.'}