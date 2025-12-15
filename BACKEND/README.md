# FOR FRONTEND(IED)
Untuk berikut bentuk JSON file yang akan dikirim

## URL API:
## 🔐 1. Auth 

### A. Register (Daftar Akun)
Mendaftarkan pengguna baru (Pasien atau Dokter).

* **URL:** `/api/auth/register`
* **Method:** `POST`
* **Content-Type:** `application/json`

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

* **URL:** `/api/auth/login`
* **Method:** `POST`
* **Content-Type:** `application/json`

**Request Body (Doctor):**
```json
{
  "email": "budi@example.com",
  "password": "password123"
}
```

### C. CREATE APPOINMENT 
Membuat jadwal temu dengan doktor

* **URL:** `/api/appointment/create-appointment`
* **Method:** `POST`
* **Content-Type:** `application/json`


```json
{
  "patient_id": 5,
  "doctor_id": 1,#sesuaikan dengan user atau doctor yang ditemu
  "appointment_date": "2025-12-25",
  "appointment_time": "14:30"
}
```

dah capek , tambahin wak