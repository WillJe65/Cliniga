# 🏥 Cliniga - Clinic Appointment System

**Cliniga** adalah solusi kesehatan digital *end-to-end* yang menghubungkan pasien dengan tenaga medis secara efisien. Proyek ini mengintegrasikan antarmuka pengguna yang modern, logika server yang kuat, dan struktur basis data relasional untuk mengelola janji temu serta rekam medis secara aman.

---

## 👥 Tim Pengembang
| Nama | NIM | Pembagian Tugas |
| :--- | :--- | :--- |
| **Dzaky Pramadhani** | 123140208 | Team Leader |
| **Mohd.Musyaffa Alief Athallah** | 123140184 | Backend Developer |
| **M. Royhan Alfitra** | 123140146 | Frontend Developer |
| **Alliyah Salsabilla** | 123140014 | Frontend Developer |
| **Afifa Aulia** | 123140073 | Frontend Developer |
| **I Gede Krisna Yoga Saputra** | 123140163 | Database Developer |

---

## 🚀 Fitur & Deskripsi Proyek
Cliniga dibangun untuk menyederhanakan birokrasi layanan kesehatan melalui beberapa modul utama:

* **Dashboard Pasien**: Visualisasi data kesehatan, statistik janji temu, dan notifikasi jadwal terdekat.
* **Jadwal Mendatang (Live Sync)**: Pelacakan janji temu secara *real-time* yang terintegrasi di seluruh antarmuka.
* **Sistem Booking Mandiri**: Pasien dapat mencari dokter spesialis berdasarkan rating dan jadwal praktik yang tersedia.
* **Manajemen Rekam Medis**: Modul khusus untuk mengakses hasil diagnosa dan laporan laboratorium secara mandiri.
* **Data Integrity**: Penyimpanan data terpusat yang menjamin keamanan informasi sensitif pasien melalui database relasional.

---

## 🛠️ Tech Stack & Arsitektur
### **Frontend**
* **Framework**: React.js (Vite)
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Navigasi**: React Router DOM (Mendukung rute terpisah untuk Dashboard, Booking, & Rekam Medis)

### **Backend**
* **Runtime**: Node.js
* **Framework**: Express.js
* **Keamanan**: JWT (JSON Web Token) untuk otentikasi akun.

### **Database**
* **Sistem**: MySQL / PostgreSQL
* **Struktur**: Relasional (Skema tersedia di folder `/databases`).

---

## 📦 Panduan Instalasi & Local Development
Ikuti langkah ini untuk menjalankan ekosistem Cliniga di lingkungan lokal:

### **1. Konfigurasi Database**
1.  Buka folder `databases`.
2.  Impor file `.sql` yang tersedia ke dalam DBMS Anda (misal: MySQL Workbench).
3.  Konfigurasikan kredensial database pada file `.env` di folder `BACKEND`.

### **2. Menjalankan Backend**
```bash
cd BACKEND
npm install
npm run dev

```

### **3. Menjalankan Frontend**

```bash
cd FRONTEND/pages_patient
npm install # Mengunduh semua library yang diperlukan
npm run dev

```
### **4. Akses aplikasi melalui browser**
Akses aplikasi melalui browser di: http://localhost:5173

---

## 📄 Dokumentasi API

Backend menyediakan endpoint utama untuk komunikasi data:

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| **GET** | `/api/appointments` | Mengambil daftar Jadwal Mendatang |
| **POST** | `/api/booking` | Membuat reservasi janji temu baru |
| **GET** | `/api/records` | Mengakses file Rekam Medis digital |

---

## 📸 Tampilan Aplikasi

### 1. Landing Page
<img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/aaa6ac39-5422-49ea-b8dc-0aa5b3677ab2" />

<img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/c9c0a274-b618-4a35-87db-5995504ac6bb" />

### 2. Halaman Login
<img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/74e8051d-a2b6-455f-95fd-80efb90e11ed" />

### 3. Dashboard Pasien
<img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/26f47fe6-7233-4d47-bca0-884f399ff498" />

### 4. Profile Akun Pasien
<img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/3a66ffd9-4d40-4f4b-adb6-476e2a477a44" />

### 5. Janji Temu Dokter
<img width="1600" height="828" alt="image" src="https://github.com/user-attachments/assets/8bc1b599-9be1-4bce-b252-367103737dc2" />

### 6. Janji Temu Mendatang
<img width="1600" height="888" alt="image" src="https://github.com/user-attachments/assets/f56b4591-4964-415a-b022-72c34f3a6fce" />

### 7. Catatan Medis
<img width="1600" height="893" alt="image" src="https://github.com/user-attachments/assets/025a3e6b-f550-4287-9d8c-5e9843991588" />

### 8. Pengaturan Akun Pasien
<img width="1600" height="899" alt="image" src="https://github.com/user-attachments/assets/3f410336-aa1c-4e33-877a-d0b7b75ec6e8" />

### 9. Dashboard Dokter
<img width="1600" height="900" alt="image" src="https://github.com/user-attachments/assets/0e5574b0-8cc4-4671-a809-8ff84d9cdeb3" />

### 10. Daftar Appointment
<img width="1600" height="897" alt="image" src="https://github.com/user-attachments/assets/80202a88-7686-4117-ac34-90b380179906" />

### 11. Appointment Masuk
<img width="1600" height="894" alt="image" src="https://github.com/user-attachments/assets/3b71484f-6668-4e98-9f01-0830c254a906" />

### 12. Profile Akun Dokter
<img width="1600" height="892" alt="image" src="https://github.com/user-attachments/assets/49af8e38-710f-4d65-aea2-b671361e72a4" />

<img width="1600" height="893" alt="image" src="https://github.com/user-attachments/assets/59876fbc-b433-4cfe-8b57-03e9f7723df9" />


### 13. Pengaturan Akun Dokter
<img width="1600" height="896" alt="image" src="https://github.com/user-attachments/assets/c73b2bfc-0028-47df-8f13-e66203e4337c" />

---

## 🎥 Video Presentasi
**Link Video Presentasi**: https://youtu.be/pSt8R0mAOlM

---

© 2025 Cliniga Project - Kelompok 5
