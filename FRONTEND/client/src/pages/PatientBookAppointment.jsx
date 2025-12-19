import React, { useState } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Plus, Calendar, ArrowLeft, X, Loader2, Stethoscope } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import PatientSidebar from '@/components/layout/PatientSidebar';
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const PatientBookAppointment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    complaint: ''
  });

  // 1. FETCH DATA DOKTER DARI API
  const { data: doctors = [], isLoading: isLoadingDoctors } = useQuery({
    queryKey: ["/api/doctors"],
  });

  // Filter Dokter di Client Side
  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.specialization || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. MUTATION UNTUK BOOKING APPOINTMENT
  const bookingMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch("/api/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat janji temu");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Berhasil",
        description: "Janji temu berhasil dibuat! Menunggu konfirmasi dokter.",
      });
      // Reset Form & Tutup Modal
      setShowScheduleModal(false);
      setScheduleData({ date: '', time: '', complaint: '' });
      setSelectedDoctor(null);
      // Redirect ke Dashboard (Opsional)
      setLocation("/patient-dashboard");
    },
    onError: (error) => {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowScheduleModal(true);
  };

  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    
    if (!scheduleData.date || !scheduleData.time) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon isi tanggal dan waktu kunjungan.",
        variant: "destructive"
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "Sesi Anda habis, silakan login ulang.",
        variant: "destructive"
      });
      return;
    }

    // Payload sesuai backend appointment.py
    const payload = {
      patient_id: user.id,
      doctor_id: selectedDoctor.id,
      appointment_date: scheduleData.date, // Format YYYY-MM-DD dari input type="date"
      appointment_time: scheduleData.time, // Format HH:MM dari input type="time"
      // Catatan: Backend Anda di 'appointment.py' saat ini belum menyimpan 'complaint' 
      // di tabel AppointmentModel, tapi kita kirim saja siapa tahu backend diupdate.
      complaint: scheduleData.complaint 
    };

    bookingMutation.mutate(payload);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <PatientSidebar />
      <div className="flex-1">
        <div className="max-w-5xl mx-auto p-8">
          <div className="mb-8">
            <Link href="/patient-dashboard">
              <a className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-semibold">
                <ArrowLeft size={18} />
                Kembali ke Dashboard
              </a>
            </Link>
            <h1 className="text-3xl font-extrabold mb-2">
              Temukan <span className="text-blue-600">Dokter Anda</span>
            </h1>
            <p className="text-gray-500">
              Jelajahi jaringan profesional kesehatan berkualitas kami.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-10">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama atau spesialisasi..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3.5 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          {/* Doctors List */}
          <div className="space-y-4">
            {isLoadingDoctors ? (
              <div className="text-center py-12 flex justify-center items-center gap-2 text-gray-500">
                <Loader2 className="animate-spin" /> Memuat data dokter...
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
                <div className="flex justify-center mb-3">
                   <Stethoscope className="h-10 w-10 text-gray-300"/>
                </div>
                <p className="text-gray-600 font-semibold">Dokter tidak ditemukan</p>
                <p className="text-sm text-gray-400">Coba kata kunci lain.</p>
              </div>
            ) : (
              filteredDoctors.map(doc => (
                <div key={doc.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm hover:shadow-md transition">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 uppercase">
                    {/* Ambil inisial dari nama */}
                    {doc.name ? doc.name.match(/\b(\w)/g)?.join('').substring(0, 2) : "DR"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{doc.name}</h3>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-gray-600 inline-block mt-1">
                      {doc.specialization || "Umum"}
                    </span>
                    <p className="text-gray-400 text-sm mt-2 flex items-center gap-1">
                      <Calendar size={14} />
                      {doc.schedule || "Jadwal belum tersedia"}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleBookAppointment(doc)}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 flex-shrink-0 w-full md:w-auto justify-center"
                  >
                    <Plus size={18} />
                    Pesan Janji
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">Jadwal Fleksibel</h3>
              <p className="text-sm text-blue-700">Pilih waktu yang sesuai dengan jadwal Anda untuk konsultasi</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">Konfirmasi Otomatis</h3>
              <p className="text-sm text-green-700">Dokter akan menerima notifikasi janji temu Anda secara real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Jadwalkan Janji Temu</h3>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setScheduleData({ date: '', time: '', complaint: '' });
                  setSelectedDoctor(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <strong>Dokter:</strong> {selectedDoctor?.name}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Spesialisasi:</strong> {selectedDoctor?.specialization}
              </p>
            </div>

            <form onSubmit={handleSubmitSchedule} className="space-y-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tanggal Janji Temu
                </label>
                <input
                  type="date"
                  value={scheduleData.date}
                  onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  min={new Date().toISOString().split('T')[0]} // Min hari ini
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Jam Janji Temu
                </label>
                <input
                  type="time"
                  value={scheduleData.time}
                  onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Complaint */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Keluhan/Alasan Kunjungan
                </label>
                <textarea
                  value={scheduleData.complaint}
                  onChange={(e) => setScheduleData({ ...scheduleData, complaint: e.target.value })}
                  placeholder="Deskripsikan keluhan atau alasan kunjungan Anda..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows="3"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setScheduleData({ date: '', time: '', complaint: '' });
                    setSelectedDoctor(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition"
                  disabled={bookingMutation.isPending}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <Calendar size={16} />
                      Jadwalkan
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Status akan berubah menjadi "Menunggu" setelah dikirim.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientBookAppointment;