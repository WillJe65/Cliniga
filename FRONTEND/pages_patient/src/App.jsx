import React from 'react';
// Perhatikan bagian import di bawah ini, kita tambahkan "as Router"
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  PlusCircle, 
  LogOut, 
  Activity, 
  FileText 
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';
import UpcomingAppointment from './pages/UpcomingAppointment';
import ProfileAccount from './pages/ProfileAccount';
import MedicalRecord from './pages/MedicalRecord';

const SidebarItem = ({ icon: Icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <Link to={path} className={`flex items-center gap-3 px-6 py-3 mx-4 rounded-xl transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
    }`}>
      <Icon size={20} />
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
};

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        {/* SIDEBAR SESUAI DESAIN */}
        <aside className="w-64 bg-white border-r border-slate-100 h-screen sticky top-0 flex flex-col">
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100 italic font-black">C</div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight italic">Cliniga</h1>
          </div>
          
          <div className="text-[10px] font-bold text-slate-400 px-10 mb-2 uppercase tracking-widest">Menu Utama</div>
          <nav className="flex-grow space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/" />
            <SidebarItem icon={PlusCircle} label="Booking Dokter" path="/book" />
            <SidebarItem icon={FileText} label="Rekam Medis" path="/records" />
            <SidebarItem icon={Calendar} label="Jadwal Mendatang" path="/upcoming" />
            <SidebarItem icon={User} label="Profil Saya" path="/profile" />
          </nav>
          
          <div className="p-6 border-t border-slate-50">
            <button onClick={() => window.location.reload()} className="flex items-center gap-3 text-red-500 font-bold hover:bg-red-50 w-full px-4 py-3 rounded-xl transition-all">
              <LogOut size={18} /><span className="text-sm">Keluar</span>
            </button>
          </div>
        </aside>

        <main className="flex-grow p-10 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/records" element={<MedicalRecord />} />
            <Route path="/upcoming" element={<UpcomingAppointment />} />
            <Route path="/profile" element={<ProfileAccount />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}