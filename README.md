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

*Visualisasi Dashboard Pasien dengan fitur Jadwal Mendatang.*

---

## 🌐 Link & Media

* **Deployment Frontend**: [Tautan Vercel/Netlify Anda]
* **Dokumentasi API**: [Tautan Postman/Swagger]
* **Video Presentasi**: [Tautan YouTube/Drive]

---

© 2025 Cliniga Project - Kelompok 5
