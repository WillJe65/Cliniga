import React, { useState } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { Clock, RotateCw, Trash2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import PatientSidebar from '@/components/layout/PatientSidebar';
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const PatientUpcomingAppointment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newTime: ''
  });

  // 1. FETCH APPOINTMENTS (Mendatang)
  const { data: responseData, isLoading } = useQuery({
    queryKey: [`/api/appointments/filter?patient_id=${user?.id}&upcoming=true`],
    enabled: !!user?.id,
  });

  const rawAppointments = responseData?.appointments || [];

  // Filter tambahan di client side 
  const appointments = rawAppointments.filter(apt => apt.status !== 'completed');

  // 2. MUTATION: UPDATE APPOINTMENT (Cancel / Reschedule)
  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch("/api/appointments/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Gagal mengupdate janji temu");
      }
      return await response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      
      const isReschedule = variables.appointment_date; 
      
      toast({
        title: isReschedule ? "Permintaan Terkirim" : "Status Diperbarui",
        description: isReschedule 
          ? "Permintaan jadwal baru telah dikirim ke dokter." 
          : "Janji temu telah dibatalkan.",
      });

      setShowRescheduleModal(false);
      setRescheduleData({ newDate: '', newTime: '' });
      setSelectedAppointment(null);
    },
    onError: (error) => {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Action: Batalkan
  const handleCancelAppointment = (id) => {
    if (confirm('Apakah Anda yakin ingin membatalkan janji temu ini?')) {
      updateMutation.mutate({
        appointment_id: id,
        status: 'cancelled'
      });
    }
  };

  // Action: Reschedule (Buka Modal)
  const handleReschedule = (apt) => {
    setSelectedAppointment(apt);
    setShowRescheduleModal(true);
  };

  // Action: Submit Reschedule
  const handleSubmitReschedule = () => {
    if (!rescheduleData.newDate || !rescheduleData.newTime) {
      toast({ title: "Data tidak lengkap", description: "Isi tanggal dan jam baru.", variant: "destructive" });
      return;
    }

    updateMutation.mutate({
      appointment_id: selectedAppointment.id,
      appointment_date: rescheduleData.newDate,
      appointment_time: rescheduleData.newTime,
      status: 'pending' // Reset ke pending agar dokter konfirmasi ulang
    });
  };

  // Helpers UI
  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Menunggu Konfirmasi';
      case 'confirmed': return 'Terkonfirmasi';
      case 'cancelled': return 'Dibatalkan';
      case 'completed': return 'Selesai';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'confirmed': return 'bg-green-50 text-green-700 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse"></div>;
      case 'confirmed': return <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>;
      case 'cancelled': return <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>;
      default: return <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>;
    }
  };

  const formatTime = (timeStr) => timeStr ? timeStr.substring(0, 5) : "-";

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
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Janji Temu Mendatang</h2>
            <p className="text-gray-600">Kelola janji temu kesehatan Anda</p>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
               <div className="text-center py-12 flex justify-center items-center gap-2 text-gray-500">
                 <Loader2 className="animate-spin" /> Memuat jadwal...
               </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
                <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Tidak ada janji temu</h3>
                <p className="text-gray-600 mt-2">Anda tidak memiliki janji temu mendatang</p>
                <Link href="/book-appointment">
                  <a className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                    Buat Janji Baru
                  </a>
                </Link>
              </div>
            ) : (
              appointments.map(apt => (
                <div key={apt.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      {/* Status Badge */}
                      <div className={`flex items-center gap-2 inline-flex px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider mb-4 ${getStatusColor(apt.status)}`}>
                        {getStatusIcon(apt.status)}
                        <span>{getStatusLabel(apt.status)}</span>
                      </div>

                      {/* Doctor Info */}
                      <div className="mb-4">
                        <h3 className="font-bold text-lg text-gray-900">{apt.doctor_name}</h3>
                        <p className="text-sm text-gray-600">{apt.doctor_specialization || "Dokter Umum"}</p>
                      </div>

                      {/* Date & Time */}
                      <div className="flex gap-6">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Tanggal</p>
                          <p className="text-sm font-bold text-gray-900">
                            {apt.appointment_date ? format(parseISO(apt.appointment_date), "d MMM yyyy", { locale: idLocale }) : "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Jam</p>
                          <p className="text-sm font-bold text-gray-900">{formatTime(apt.appointment_time)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {apt.status !== 'cancelled' ? (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleReschedule(apt)}
                          disabled={updateMutation.isPending}
                          className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                        >
                          <RotateCw size={16} />
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(apt.id)}
                          disabled={updateMutation.isPending}
                          className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                          Batalkan
                        </button>
                      </div>
                    ) : (
                      <div className="px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold opacity-70">
                        Dibatalkan
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Reschedule Modal */}
          {showRescheduleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Penjadwalan Ulang Janji Temu</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Dokter: <strong>{selectedAppointment?.doctor_name}</strong>
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Tanggal Baru
                    </label>
                    <input
                      type="date"
                      value={rescheduleData.newDate}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Jam Baru
                    </label>
                    <input
                      type="time"
                      value={rescheduleData.newTime}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, newTime: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowRescheduleModal(false);
                      setRescheduleData({ newDate: '', newTime: '' });
                    }}
                    disabled={updateMutation.isPending}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmitReschedule}
                    disabled={updateMutation.isPending}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    {updateMutation.isPending ? <Loader2 className="animate-spin h-4 w-4"/> : "Kirim Permintaan"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientUpcomingAppointment;