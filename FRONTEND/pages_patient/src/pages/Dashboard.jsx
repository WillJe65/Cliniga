import React from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  CheckCircle, 
  FileText, 
  PlusCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const upcomingAppointments = [
    { doctor: "Dr. Sarah Smith", spec: "Cardiology", time: "10:00 WIB", date: "Besok", initial: "SS" },
    { doctor: "Dr. Michael Johnson", spec: "Dermatology", time: "14:30 WIB", date: "20 Des", initial: "MJ" }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 text-left">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Halo, Alliyah 👋</h1>
        <p className="text-slate-400 mt-1">Berikut ringkasan jadwal dan aktivitas kesehatan Anda.</p>
      </header>

      {/* STATS BARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Calendar size={24} /></div>
          <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Janji Aktif</p><p className="text-xl font-bold">2</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><CheckCircle size={24} /></div>
          <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Selesai</p><p className="text-xl font-bold">14</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><FileText size={24} /></div>
          <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Laporan</p><p className="text-xl font-bold">8</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LIST JADWAL MENDATANG (DIUBAH DARI JANJI TEMU) */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 text-left">Jadwal Mendatang</h3>
            <Link to="/upcoming" className="text-blue-600 text-sm font-bold hover:underline">Lihat Semua</Link>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((apt, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer group">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-blue-600 border border-slate-100 shadow-sm uppercase">{apt.initial}</div>
                  <div>
                    <p className="font-bold text-slate-800">{apt.doctor}</p>
                    <p className="text-xs text-slate-400">{apt.spec}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700 flex items-center justify-end gap-1"><Clock size={14}/> {apt.time}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{apt.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AKSES CEPAT */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 text-left">Akses Cepat</h3>
          <Link to="/book" className="flex items-center justify-between p-6 bg-blue-600 text-white rounded-3xl shadow-lg shadow-blue-100 group">
            <div className="flex items-center gap-4 text-left">
              <PlusCircle size={28} />
              <div><p className="font-bold">Booking Dokter</p><p className="text-xs opacity-80">Daftar pemeriksaan baru</p></div>
            </div>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/records" className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl shadow-sm group hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><FileText size={24} /></div>
              <div><p className="font-bold text-slate-800">Cek Rekam Medis</p><p className="text-xs text-slate-400">Lihat hasil pemeriksaan lalu</p></div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;