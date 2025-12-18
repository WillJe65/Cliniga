# 🏥 Cliniga - Doctor Dashboard Module (Frontend)

Implementasi frontend halaman kerja dokter (*Doctor Workspace*) untuk memantau jadwal dan melakukan pemeriksaan pasien secara digital.

---

## 📋 Deskripsi Proyek

Modul ini mensimulasikan lingkungan kerja dokter (*Doctor Workspace*) di mana pengguna dapat:
1.  Melihat ringkasan statistik pasien hari ini.
2.  Melihat jadwal praktik resmi.
3.  Mengelola antrian pasien dalam bentuk tabel interaktif.
4.  Melakukan tindakan pemeriksaan (input diagnosa & resep) tanpa berpindah halaman.

---

## ✨ Fitur Utama 

### 1. Sidebar & Identitas Dokter
* **Branding:** Logo Cliniga dan identitas dokter (Dr. Sarah Smith).
* **Jadwal Praktik:** Widget informasi hari dan jam praktik yang terintegrasi di sidebar (sesuai revisi desain).
* **Navigasi:** Menu aktif visual (*Active State*) pada tab Dashboard.

### 2. Statistik Real-Time (Reactive)
* Menampilkan 4 kartu statistik: **Total Pasien**, **Selesai**, **Menunggu**, dan **Dibatalkan**.
* **Logika Otomatis:** Angka pada statistik akan berubah secara *real-time* ketika dokter menyelesaikan pemeriksaan pasien.

### 3. Manajemen Antrian Pasien
* Tabel daftar pasien dengan informasi: ID, Nama, Usia, Waktu Kedatangan, dan Keluhan Utama.
* **Status Badge:** Indikator warna untuk status (Kuning: Menunggu, Biru: Diperiksa, Hijau: Selesai).
* **Tombol Aksi:** Tombol "Periksa" hanya aktif pada pasien yang belum selesai.

### 4. Input Rekam Medis (Modal Pop-up)
* **Interaksi Seamless:** Formulir muncul dalam jendela *Overlay/Modal* (tidak reload halaman).
* **Detail Pasien:** Menampilkan ID, Nama, dan Keluhan Pasien di header modal.
* **Formulir Medis:** Input untuk **Diagnosa Dokter** dan **Resep Obat**.
* **Feedback Loop:** Setelah data disimpan, status pasien di tabel otomatis berubah menjadi **"✅ Selesai"** (Hijau).

---

## 🛠️ Teknologi yang Digunakan

* **Core:** [React.js](https://react.dev/) (Vite Environment)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Custom Font: Plus Jakarta Sans)
* **Icons:** [Lucide React](https://lucide.dev/)
* **State Management:** React `useState` & `useEffect`



