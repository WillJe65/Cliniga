import React from 'react';
import { Home, Calendar, Users, FileText, Settings, LogOut, Activity, Clock } from 'lucide-react';

const DoctorSidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Calendar, label: 'Jadwal Praktek' },
    { icon: Users, label: 'Data Pasien' },
    { icon: FileText, label: 'Rekam Medis' },
    { icon: Settings, label: 'Pengaturan' },
  ];

  return (
    <div className="w-72 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50">
      
      {/* 1. Header branding */}
      <div className="px-8 pt-8 pb-4 flex items-center gap-3">
        <div className="bg-cliniga-primary text-white p-2 rounded-lg">
          <Activity size={24} strokeWidth={3} />
        </div>
        <span className="text-2xl font-bold text-slate-800 tracking-tight font-sans">Cliniga</span>
      </div>

      {/* 2.Profil Dokter */}
      <div className="px-6 py-6 mx-4 mb-2 mt-2 border-b border-slate-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-cliniga-primary text-xl font-bold border-4 border-slate-50 shadow-sm">
          SS
        </div>
        <h2 className="text-lg font-bold text-cliniga-text leading-tight">Dr. Sarah Smith</h2>
        <p className="text-slate-400 text-xs mt-1">Spesialis Jantung</p>
      </div>
      
      {/* 3.Menu navigasi */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-2">Menu Utama</p>
        {menuItems.map((item, index) => (
          <button 
            key={index}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
              item.active 
                ? 'bg-cliniga-primary text-white shadow-md shadow-blue-200' 
                : 'text-slate-500 hover:bg-blue-50 hover:text-cliniga-primary'
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-6 pb-2">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-700">
            <Clock size={16} className="text-cliniga-primary"/>
            <span className="text-xs font-bold uppercase tracking-wide">Jadwal Praktik</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Senin - Jumat</span>
              <span className="font-semibold text-slate-700">09:00 - 15:00</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Sabtu</span>
              <span className="font-semibold text-slate-700">09:00 - 12:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TOMBOL KELUAR */}
      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium text-sm group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Keluar Aplikasi</span>
        </button>
      </div>
    </div>
  );
};

export default DoctorSidebar;