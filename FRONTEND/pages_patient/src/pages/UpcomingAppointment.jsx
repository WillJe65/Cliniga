import React from 'react';
import { Calendar, Clock, XCircle, RefreshCw, MapPin } from 'lucide-react';

export default function UpcomingAppointment() {
  const handleAction = (type) => alert(`Permintaan ${type} telah dikirim ke admin.`);
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Jadwal <span className="text-blue-600">Mendatang</span></h1>
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Terjadwal</span>
            <h3 className="text-2xl font-bold text-slate-800">Dr. Sarah Smith</h3>
            <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1.5"><Calendar size={16}/> 20 Dec 2025</span>
              <span className="flex items-center gap-1.5"><Clock size={16}/> 10:00 AM</span>
              <span className="flex items-center gap-1.5"><MapPin size={16}/> Klinik Jantung</span>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => handleAction('Reschedule')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold hover:bg-blue-100 transition"><RefreshCw size={18} /> Reschedule</button>
            <button onClick={() => handleAction('Cancel')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition"><XCircle size={18} /> Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}