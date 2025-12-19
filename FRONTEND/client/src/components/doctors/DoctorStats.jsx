import React from 'react';
import { Users, CheckCircle, Clock, CalendarX, Activity } from 'lucide-react';

const DoctorStats = ({ stats }) => {
  const statItems = [
    { 
      label: 'Total Pasien', 
      value: stats.total, 
      icon: Users, 
      color: 'text-blue-600',
      bgIcon: 'bg-blue-50',
      borderColor: 'border-b-blue-500' // Aksen warna di bawah
    },
    { 
      label: 'Selesai Diperiksa', 
      value: stats.selesai, 
      icon: CheckCircle, 
      color: 'text-green-600',
      bgIcon: 'bg-green-50',
      borderColor: 'border-b-green-500'
    },
    { 
      label: 'Menunggu / Proses', 
      value: stats.pending, 
      icon: Clock, 
      color: 'text-orange-600',
      bgIcon: 'bg-orange-50',
      borderColor: 'border-b-orange-500'
    },
    { 
      label: 'Dibatalkan', 
      value: stats.batal, 
      icon: CalendarX, 
      color: 'text-red-600',
      bgIcon: 'bg-red-50',
      borderColor: 'border-b-red-500'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className={`bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group`}
        >
          {/* Aksen Garis Warna di Bawah */}
          <div className={`absolute bottom-0 left-0 w-full h-1 ${item.color.replace('text', 'bg')} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-2">{item.label}</p>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight font-sans">
                {item.value}
              </h3>
            </div>
            
            {/* Icon Container */}
            <div className={`p-3.5 rounded-xl ${item.bgIcon} ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
              <item.icon size={24} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorStats;
