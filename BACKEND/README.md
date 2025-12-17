# FOR FRONTEND(IED)

Untuk berikut bentuk JSON file yang akan dikirim

## URL API:

## 🔐 1. Auth

### A. Register (Daftar Akun)

Mendaftarkan pengguna baru (Pasien atau Dokter).

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Content-Type:** `application/json`

### UNTUK PASIEN:

**Request Body (Pasien):**

```json
{
  "name": "NateHiggers",
  "email": "100blackfor50pounds@example.com",
  "password": "yessir",
  "role": "patient"
}
```

### UNTUK DOCTOR:

**Request Body (Doctor):**

```json
{
  "name": "Dr. black",
  "email": "strange@gmail.com",
  "password": "black123",
  "role": "doctor",
  "specialization": "Bedah ngawi",
  "schedule": "Senin - Jumat (09:00 - 15:00)"
}
```

### B. Login Akun

Login akun yang sudah terdaftar

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Content-Type:** `application/json`

**login Body :**

```json
{
  "email": "budi@example.com",
  "password": "password123"
}
```

### C. CREATE APPOINMENT

Membuat jadwal temu dengan doktor

- **URL:** `/api/appointment/create-appointment`
- **Method:** `POST`
- **Content-Type:** `application/json`

```json
{
  "patient_id": 5,
  "doctor_id": 1,#sesuaikan dengan user atau doctor yang ditemu
  "appointment_date": "2025-12-25",
  "appointment_time": "14:30"
}
```

## 👤 2. Fitur Akun (Account)

Fitur ini digunakan untuk mengelola profil pengguna, baik bagi Pasien maupun Dokter.

### A. Lihat Profil (Profile)

Mengambil informasi detail akun. Jika pengguna adalah Dokter, data spesialisasi dan jadwal akan disertakan.

- **URL:** `/api/account/profile`
- **Method:** `POST`
- **Params:** `user_id=[id_user]`

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Dr. Suroso",
    "email": "strange@gmail.com",
    "role": "doctor",
    "created_at": "2025-01-01 10:00:00",
    "doctor_info": {
      "doctor_id": 1,
      "specialization": "Bedah Syaraf",
      "schedule": "Senin - Jumat (09:00 - 15:00)"
    }
  }
}
```

### B. Ubah Kata Sandi (Change Password)

Mengupdate password lama ke password baru dengan verifikasi keamanan.

- **URL:** `/api/account/change-password`
- **Method:** `PUT`
- **Body:**

```json
{
  "user_id": 5,
  "old_password": "passwordLama123",
  "new_password": "passwordBaru456"
}
```

### C. Update Jadwal Praktik (Khusus Dokter)

Memperbarui informasi waktu pelayanan dokter yang akan tampil di profil.

- **URL:** `/api/account/update-schedule`
- **Method:** `PUT`
- **Body:**

```json
{
  "user_id": 1,
  "schedule": "Sabtu - Minggu (10:00 - 14:00)"
}
```

### D. Logout

Menghapus sesi pengguna di sisi client.

- **URL:** `/api/account/logout`
- **Method:** `POST`

## 🏥 3. Fitur Rekam Medis (Medical Record)

Fitur ini menangani pencatatan hasil pemeriksaan oleh dokter dan riwayat kesehatan pasien.

### A. Buat Rekam Medis (Input Dokter)

Dokter mengisi diagnosa setelah janji temu selesai. Sistem akan otomatis mengubah status janji temu menjadi `completed`.

- **URL:** `/api/medical-record/create` (Berdasarkan route `create_medical_record`)
- **Method:** `POST`
- **Body:**

```json
{
  "appointment_id": 101,
  "diagnosis": "Influenza Tipe A",
  "notes": "Minum obat rutin dan istirahat 3 hari"
}
```

### B. Lihat Detail Rekam Medis (Berdasarkan Appointment)

Melihat hasil diagnosa spesifik dari satu sesi kunjungan.

- **URL:** `/api/medical-record/get`(Berdasarkan route `get_medical_record)`)
- **Method:** `GET`
- **Params:** `appointment_id=[id]`

### C. Riwayat Kesehatan Pasien (History)

Melihat daftar seluruh rekam medis yang pernah dicatat untuk satu pasien tertentu.

- **URL:** `/api/medical-record/history`(Berdasarkan route `get_patient_history`)
- **Method:** `GET`
- **Params:** `patient_id=[id]`

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "appointment_id": 101,
      "appointment_date": "2025-12-25",
      "diagnosis": "Influenza Tipe A",
      "notes": "Minum obat rutin"
    }
  ]
}
```
