import React, { useState } from 'react';
import { Link } from 'wouter';
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import DoctorStats from '@/components/doctors/DoctorStats';
import MedicalRecordModal from '@/components/modals/MedicalRecordModal';
import { Button } from '@/components/ui/button';
import { Search, Bell, Filter, FilePlus, CheckCircle } from 'lucide-react';

function DoctorDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // DATA PASIEN (State)
  const [patients, setPatients] = useState([
    { id: '#P-001', name: 'Budi Santoso', age: 45, time: '09:00 WIB', status: 'Menunggu', complaint: 'Nyeri Dada Kiri' },
    { id: '#P-002', name: 'Siti Aminah', age: 32, time: '09:30 WIB', status: 'Diperiksa', complaint: 'Sesak Nafas' },
    { id: '#P-003', name: 'Rudi Hermawan', age: 28, time: '10:00 WIB', status: 'Selesai', complaint: 'Check-up Rutin' },
    { id: '#P-004', name: 'Linda Kusuma', age: 55, time: '10:30 WIB', status: 'Menunggu', complaint: 'Tekanan Darah Tinggi' },
    { id: '#P-005', name: 'Ahmad Dahlan', age: 61, time: '11:00 WIB', status: 'Batal', complaint: 'Reschedule' },
  ]);

  // --- LOGIKA MENGHITUNG STATISTIK ---
  // Kita hitung ulang setiap kali data 'patients' berubah
  const stats = {
    total: patients.length,
    selesai: patients.filter(p => p.status === 'Selesai').length,
    // Pending = Status 'Menunggu' ATAU 'Diperiksa'
    pending: patients.filter(p => p.status === 'Menunggu' || p.status === 'Diperiksa').length,
    batal: patients.filter(p => p.status === 'Batal').length
  };

  const handlePeriksaClick = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleSaveRecord = (patientId, recordData) => {
    console.log("Data Disimpan:", recordData);
    
    // Update status pasien jadi 'Selesai'
    setPatients(patients.map(p => 
      p.id === patientId ? { ...p, status: 'Selesai' } : p
    ));
    
    // Alert browser standar (opsional)
    // alert(`Rekam Medis ${selectedPatient.name} Berhasil Disimpan!`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Menunggu': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Diperiksa': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Selesai': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DoctorSidebar />

      <main className="flex-1 ml-72 px-12 py-10">
        <header className="flex justify-between items-center mb-10">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-cliniga-text">Selamat Pagi, Dr. Sarah 👋</h1>
            <p className="text-cliniga-grey text-lg mt-1">Berikut ringkasan jadwal praktek Anda hari ini.</p>
          </div>
          <div className="flex items-center space-x-5">
            <Link href="/">
              <Button variant="outline">← Kembali ke Landing Page</Button>
            </Link>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Cari nama pasien..." className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 shadow-sm" />
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 relative shadow-sm">
              <Bell size={22} />
              <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* MENGIRIM DATA STATISTIK KE COMPONENT */}
        <DoctorStats stats={stats} />

        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100/50 overflow-hidden mt-10">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
            <div>
              <h3 className="text-xl font-bold text-cliniga-text">Antrian Pasien Hari Ini</h3>
              <p className="text-slate-500 mt-1">Rabu, 18 Des 2025</p>
            </div>
            <button className="flex items-center space-x-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={18} />
              <span>Filter Data</span>
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ID Pasien</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Pasien</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Keluhan</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((patient, index) => (
                <tr key={index} className="hover:bg-blue-50/60 transition-colors group">
                  <td className="px-8 py-5 text-sm font-semibold text-slate-600">{patient.id}</td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-cliniga-text group-hover:text-blue-600 transition-colors">{patient.name}</span>
                      <span className="text-xs text-slate-400 mt-0.5">{patient.age} Tahun</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-600 font-medium bg-slate-50/30 rounded-lg">{patient.time}</td>
                  <td className="px-8 py-5 text-sm text-slate-700 max-w-xs truncate">{patient.complaint}</td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {patient.status === 'Selesai' ? (
                      <span className="inline-flex items-center text-green-600 text-sm font-bold gap-1 ml-auto">
                        <CheckCircle size={18} /> Selesai
                      </span>
                    ) : patient.status === 'Batal' ? (
                       <span className="text-slate-400 text-sm font-medium italic">Dibatalkan</span>
                    ) : (
                      <button 
                        onClick={() => handlePeriksaClick(patient)}
                        className="bg-cliniga-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-200 hover:shadow-lg flex items-center space-x-2 ml-auto"
                      >
                        <FilePlus size={18} />
                        <span>Periksa</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-6 border-t border-slate-100 bg-slate-50 text-center text-sm font-medium text-slate-500">
            Menampilkan {patients.length} antrian pasien hari ini
          </div>
        </div>
      </main>

      <MedicalRecordModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={selectedPatient}
        onSubmit={handleSaveRecord}
      />
    </div>
  );
}

export default DoctorDashboard;
