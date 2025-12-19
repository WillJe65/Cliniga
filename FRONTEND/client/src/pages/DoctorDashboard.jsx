import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation } from "@tanstack/react-query";
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import DoctorStats from '@/components/doctors/DoctorStats';
import MedicalRecordModal from '@/components/modals/MedicalRecordModal';
import { Button } from '@/components/ui/button';
import { Search, Bell, Filter, FilePlus, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { queryClient } from "@/lib/queryClient";
import { format, isToday, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";

function DoctorDashboard() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ----------------------------------------------------------------
  // 1. LOGIC: DAPATKAN DOCTOR ID (Sama seperti halaman lain)
  // ----------------------------------------------------------------
  useEffect(() => {
    if (user?.role === 'doctor') {
      const profile = localStorage.getItem("cliniga_doctor_profile");
      if (profile) {
        try {
          const parsed = JSON.parse(profile);
          if (parsed.id) setDoctorId(parsed.id);
        } catch (e) { console.error(e); }
      }
    }
  }, [user]);

  const { data: doctorsList } = useQuery({
    queryKey: ["/api/doctors"],
    enabled: user?.role === 'doctor' && !doctorId
  });

  useEffect(() => {
    if (doctorsList && user?.role === 'doctor' && !doctorId) {
      const myProfile = doctorsList.find((d) => d.name === user.name);
      if (myProfile) setDoctorId(myProfile.id);
    }
  }, [doctorsList, user, doctorId]);

  // ----------------------------------------------------------------
  // 2. FETCH APPOINTMENTS
  // ----------------------------------------------------------------
  const { data: responseData, isLoading } = useQuery({
    queryKey: [`/api/appointments/filter?doctor_id=${doctorId}`],
    enabled: !!doctorId,
  });

  const allAppointments = responseData?.appointments || [];

  // ----------------------------------------------------------------
  // 3. FILTER & OLAH DATA (Hanya Tampilkan HARI INI)
  // ----------------------------------------------------------------

  const mapStatus = (apiStatus) => {
    switch(apiStatus) {
      case 'completed': return 'Selesai';
      case 'confirmed': return 'Diperiksa'; 
      case 'pending': return 'Menunggu';
      case 'cancelled': return 'Batal';
      default: return 'Menunggu';
    }
  };

  // Filter hanya appointment HARI INI
  const todayAppointments = allAppointments.filter(apt => {
    // 1. Cek Tanggal Hari Ini
    const isDateToday = apt.appointment_date ? isToday(parseISO(apt.appointment_date)) : false;
    // 2. Cek Search Term
    const matchesSearch = (apt.patient_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    return isDateToday && matchesSearch;
  });

  // Hitung Statistik Harian
  const stats = {
    total: todayAppointments.length,
    selesai: todayAppointments.filter(p => p.status === 'completed').length,
    pending: todayAppointments.filter(p => p.status === 'pending' || p.status === 'confirmed').length,
    batal: todayAppointments.filter(p => p.status === 'cancelled').length
  };

  const getStatusColor = (uiStatus) => {
    switch(uiStatus) {
      case 'Menunggu': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Diperiksa': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Selesai': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200'; // Batal
    }
  };

  // ----------------------------------------------------------------
  // 4. ACTION HANDLERS
  // ----------------------------------------------------------------
  const handlePeriksaClick = (appointment) => {
    setSelectedPatient({
      ...appointment,
      name: appointment.patient_name, // Modal mungkin butuh prop 'name'
      id: appointment.id // Ini adalah Appointment ID
    });
    setIsModalOpen(true);
  };

  // Mutation untuk Simpan Rekam Medis & Update Status
  const saveMutation = useMutation({
    mutationFn: async ({ appointmentId, recordData }) => {
      // 1. Simpan Rekam Medis
      const resRecord = await fetch("/api/medical-records/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment_id: parseInt(appointmentId),
          diagnosis: recordData.diagnosis,
          notes: recordData.notes || recordData.treatment 
        }),
      });
      if (!resRecord.ok) throw new Error("Gagal simpan rekam medis");

      // 2. Update Status Appointment jadi 'completed'
      const resStatus = await fetch("/api/appointments/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment_id: parseInt(appointmentId),
          status: 'completed'
        }),
      });
      if (!resStatus.ok) throw new Error("Gagal update status");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/appointments/filter?doctor_id=${doctorId}`] });
      setIsModalOpen(false);
    },
    onError: (err) => {
      alert("Error: " + err.message);
    }
  });

  const handleSaveRecord = (appointmentId, recordData) => {
    saveMutation.mutate({ appointmentId, recordData });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DoctorSidebar />

      <main className="flex-1 ml-72 px-12 py-10">
        <header className="flex justify-between items-center mb-10">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-cliniga-text">Selamat Pagi, {user?.name} 👋</h1>
            <p className="text-cliniga-grey text-lg mt-1">Berikut ringkasan jadwal praktek Anda hari ini.</p>
          </div>
          <div className="flex items-center space-x-5">
            <Link href="/">
              <Button variant="outline">← Kembali ke Landing Page</Button>
            </Link>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Cari nama pasien..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 shadow-sm" 
              />
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 relative shadow-sm">
              <Bell size={22} />
              <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Component Stats */}
        <DoctorStats stats={stats} />

        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100/50 overflow-hidden mt-10">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
            <div>
              <h3 className="text-xl font-bold text-cliniga-text">Antrian Pasien Hari Ini</h3>
              <p className="text-slate-500 mt-1">
                {format(new Date(), "EEEE, d MMMM yyyy", { locale: idLocale })}
              </p>
            </div>
            <button className="flex items-center space-x-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={18} />
              <span>Filter Data</span>
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ID Appointment</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Pasien</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Keluhan</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-10 text-center text-slate-500">
                     <div className="flex justify-center items-center gap-2"><Loader2 className="animate-spin"/> Memuat data...</div>
                  </td>
                </tr>
              ) : todayAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-10 text-center text-slate-500">
                    Tidak ada jadwal pasien hari ini.
                  </td>
                </tr>
              ) : (
                todayAppointments.map((apt, index) => {
                  const uiStatus = mapStatus(apt.status);
                  return (
                    <tr key={index} className="hover:bg-blue-50/60 transition-colors group">
                      <td className="px-8 py-5 text-sm font-semibold text-slate-600">#{apt.id}</td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-base font-bold text-cliniga-text group-hover:text-blue-600 transition-colors">
                            {apt.patient_name}
                          </span>
                          {/* Jika API belum return umur, bisa dikosongkan atau fetch detail user */}
                          <span className="text-xs text-slate-400 mt-0.5">Pasien Umum</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                        <span className="bg-slate-50/30 rounded-lg px-2 py-1">
                          {apt.appointment_time?.substring(0,5)} WIB
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-700 max-w-xs truncate">
                        {/* Jika API belum ada field 'complaint', gunakan placeholder */}
                        {apt.complaint || "Keluhan belum dicatat"}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(uiStatus)}`}>
                          {uiStatus}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {uiStatus === 'Selesai' ? (
                          <span className="inline-flex items-center text-green-600 text-sm font-bold gap-1 ml-auto">
                            <CheckCircle size={18} /> Selesai
                          </span>
                        ) : uiStatus === 'Batal' ? (
                          <span className="text-slate-400 text-sm font-medium italic">Dibatalkan</span>
                        ) : (
                          // Jika status Menunggu/Diperiksa, tampilkan tombol Periksa
                          // Opsional: Bisa Link ke /doctor-confirm-appointment/{id} ATAU pakai Modal
                          <button 
                            onClick={() => handlePeriksaClick(apt)}
                            className="bg-cliniga-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-200 hover:shadow-lg flex items-center space-x-2 ml-auto"
                          >
                            <FilePlus size={18} />
                            <span>Periksa</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <div className="p-6 border-t border-slate-100 bg-slate-50 text-center text-sm font-medium text-slate-500">
            Menampilkan {todayAppointments.length} antrian pasien hari ini
          </div>
        </div>
      </main>

      {/* Modal Rekam Medis */}
      <MedicalRecordModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={selectedPatient}
        onSubmit={handleSaveRecord} // Ini akan memanggil saveMutation
        isSubmitting={saveMutation.isPending}
      />
    </div>
  );
}

export default DoctorDashboard;