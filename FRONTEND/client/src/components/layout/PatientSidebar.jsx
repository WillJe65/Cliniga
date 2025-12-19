import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  User, 
  Calendar, 
  PlusCircle, 
  FileText, 
  LogOut,
  ChevronRight,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const PatientSidebar = () => {
  const [location] = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      icon: Home,
      label: 'Dasbor',
      path: '/patient-dashboard',
      description: 'Halaman utama'
    },
    {
      icon: User,
      label: 'Profil Akun',
      path: '/patient-profile',
      description: 'Informasi akun'
    },
    {
      icon: PlusCircle,
      label: 'Pesan Janji Temu',
      path: '/patient-book',
      description: 'Buat janji temu'
    },
    {
      icon: Calendar,
      label: 'Janji Temu Mendatang',
      path: '/patient-upcoming',
      description: 'Jadwal temu mendatang'
    },
    {
      icon: FileText,
      label: 'Catatan Medis',
      path: '/patient-medical-records',
      description: 'Riwayat medis'
    },
    {
      icon: Settings,
      label: 'Pengaturan',
      path: '/patient-settings',
      description: 'Pengaturan akun'
    },
  ];

  const isActive = (path) => location === path;

  return (
    <div className="w-72 bg-white border-r border-gray-200 min-h-screen sticky top-0 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/">
          <a className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft size={18} />
            <span className="text-sm font-semibold">Kembali ke beranda</span>
          </a>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Pasien</h1>
        <p className="text-xs text-gray-500 mt-1">Menu Navigasi</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link key={item.path} href={item.path}>
              <a className={`flex items-center gap-3 px-4 py-3 rounded-xl transition group ${
                active 
                  ? 'bg-blue-50 border-l-4 border-blue-600' 
                  : 'hover:bg-gray-50 border-l-4 border-transparent'
              }`}>
                <Icon size={20} className={active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                <div className="flex-1 text-left">
                  <p className={`text-sm font-semibold ${active ? 'text-blue-600' : 'text-gray-700 group-hover:text-gray-900'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                {active && <ChevronRight size={16} className="text-blue-600" />}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            logout();
            window.location.href = '/';
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-semibold text-sm"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </div>
  );
};

export default PatientSidebar;
