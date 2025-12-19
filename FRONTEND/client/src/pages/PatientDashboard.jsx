import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, PlusCircle, FileText, User, ChevronRight, Clock, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import PatientSidebar from '@/components/layout/PatientSidebar';

const PatientDashboard = () => {
  const { user } = useAuth();

  // 1. FETCH APPOINTMENTS UNTUK STATISTIK
  const { data: responseData, isLoading } = useQuery({
    queryKey: [`/api/appointments/filter?patient_id=${user?.id}`],
    enabled: !!user?.id, // Hanya jalan jika user sudah login
  });

  const appointments = responseData?.appointments || [];

  // 2. HITUNG STATISTIK
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Janji Mendatang: Tanggal >= Hari ini, dan status bukan batal/selesai
  const upcomingCount = appointments.filter(apt => 
    (apt.appointment_date >= todayStr) && 
    apt.status !== 'cancelled' && 
    apt.status !== 'completed'
  ).length;

  // Riwayat Kesehatan: Status 'completed' (dianggap sudah ada rekam medis)
  const historyCount = appointments.filter(apt => apt.status === 'completed').length;

  // Dokter Pilihan: Jumlah dokter unik yang pernah berinteraksi dengan pasien ini
  const uniqueDoctorsCount = new Set(appointments.map(apt => apt.doctor_id)).size;

  const menus = [
    { 
      title: 'Profil Akun', 
      desc: 'Informasi akun & pengaturan', 
      icon: User, 
      path: '/patient-profile',
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      title: 'Pesan Janji Temu', 
      desc: 'Cari dokter & buat janji', 
      icon: PlusCircle, 
      path: '/patient-book',
      color: 'bg-green-50 text-green-600'
    },
    { 
      title: 'Janji Mendatang', 
      desc: 'Cek jadwal janji temu', 
      icon: Clock, 
      path: '/patient-upcoming',
      color: 'bg-yellow-50 text-yellow-600'
    },
    { 
      title: 'Catatan Medis', 
      desc: 'Catatan medis (Hanya Baca)', 
      icon: FileText, 
      path: '/patient-medical-records',
      color: 'bg-purple-50 text-purple-600'
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <PatientSidebar />
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Dasbor <span className="text-blue-600">Pasien</span>
            </h1>
            <p className="text-gray-500 mt-2">
              Selamat datang, {user?.name || 'Pasien'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menus.map((menu, idx) => {
              const IconComponent = menu.icon;
              return (
                <Link key={idx} href={menu.path}>
                  <a className="block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group cursor-pointer">
                    <div className={`w-12 h-12 ${menu.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                      <IconComponent size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900">{menu.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 mb-4">{menu.desc}</p>
                    <div className="flex items-center text-blue-600 text-xs font-bold">
                      Buka <ChevronRight size={14} className="ml-1" />
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Janji Temu Mendatang</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : upcomingCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <Calendar size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Riwayat Kesehatan</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : historyCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                  <FileText size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Dokter Dikunjungi</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : uniqueDoctorsCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                  <User size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;