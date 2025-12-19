import React, { useState } from 'react';
import { Clock, RotateCw, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import PatientSidebar from '@/components/layout/PatientSidebar';

const PatientUpcomingAppointment = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Smith",
      specialty: "Cardiology",
      date: "20 Dec 2025",
      time: "10:00 AM",
      status: "waiting",
      statusLabel: "Menunggu Konfirmasi Dokter"
    },
    {
      id: 2,
      doctor: "Dr. Michael Johnson",
      specialty: "Dermatology",
      date: "25 Dec 2025",
      time: "02:00 PM",
      status: "confirmed",
      statusLabel: "Terkonfirmasi"
    }
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newTime: ''
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'waiting':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'waiting':
        return <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse"></div>;
      case 'confirmed':
        return <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>;
      default:
        return <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>;
    }
  };

  const handleCancelAppointment = (id) => {
    if (confirm('Apakah Anda yakin ingin membatalkan janji temu ini?')) {
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: 'cancelled', statusLabel: 'Dibatalkan' } : apt
      ));
      alert('Janji temu telah dibatalkan');
    }
  };

  const handleReschedule = (apt) => {
    setSelectedAppointment(apt);
    setShowRescheduleModal(true);
  };

  const handleSubmitReschedule = () => {
    if (!rescheduleData.newDate || !rescheduleData.newTime) {
      alert('Mohon lengkapi tanggal dan jam baru');
      return;
    }

    setAppointments(appointments.map(apt => 
      apt.id === selectedAppointment.id 
        ? { 
            ...apt, 
            date: rescheduleData.newDate,
            time: rescheduleData.newTime,
            status: 'waiting',
            statusLabel: 'Menunggu Konfirmasi Dokter'
          } 
        : apt
    ));

    setShowRescheduleModal(false);
    setRescheduleData({ newDate: '', newTime: '' });
    setSelectedAppointment(null);
    alert('Permintaan penjadwalan ulang telah dikirim. Menunggu konfirmasi dari dokter.');
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
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Janji Temu Mendatang</h2>
            <p className="text-gray-600">Kelola janji temu kesehatan Anda</p>
          </div>
          
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
                <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Tidak ada janji temu</h3>
                <p className="text-gray-600 mt-2">Anda tidak memiliki janji temu yang dijadwalkan</p>
                <Link href="/patient-book">
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
                        <span>{apt.statusLabel}</span>
                      </div>

                      {/* Doctor Info */}
                      <div className="mb-4">
                        <h3 className="font-bold text-lg text-gray-900">{apt.doctor}</h3>
                        <p className="text-sm text-gray-600">{apt.specialty}</p>
                      </div>

                      {/* Date & Time */}
                      <div className="flex gap-6">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Tanggal</p>
                          <p className="text-sm font-bold text-gray-900">{apt.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Jam</p>
                          <p className="text-sm font-bold text-gray-900">{apt.time}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {apt.status !== 'cancelled' && (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleReschedule(apt)}
                          className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition flex items-center gap-2 whitespace-nowrap"
                        >
                          <RotateCw size={16} />
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(apt.id)}
                          className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition flex items-center gap-2 whitespace-nowrap"
                        >
                          <Trash2 size={16} />
                          Batalkan
                        </button>
                      </div>
                    )}

                    {apt.status === 'cancelled' && (
                      <div className="px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold">
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Penjadwalan Ulang Janji Temu</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Dokter: <strong>{selectedAppointment?.doctor}</strong>
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
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmitReschedule}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    Kirim Permintaan
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
