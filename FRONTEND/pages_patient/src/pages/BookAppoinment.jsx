import React from 'react';
import { Search, Calendar, Star, ChevronRight, MapPin } from 'lucide-react';

const BookAppointment = () => {
  const doctors = [
    { id: 1, name: "Dr. Sarah Smith", spec: "Cardiology", initial: "SS", time: "Mon-Fri, 09:00 - 17:00", desc: "Spesialis jantung dengan pengalaman lebih dari 15 tahun dalam bedah kardiovaskular.", rating: "4.9" },
    { id: 2, name: "Dr. Michael Johnson", spec: "Dermatology", initial: "MJ", time: "Mon-Thu, 10:00 - 18:00", desc: "Ahli kesehatan kulit dan estetika, menangani berbagai kondisi dermatologis kronis.", rating: "4.8" },
    { id: 3, name: "Dr. Emily Williams", spec: "Pediatrics", initial: "EW", time: "Mon-Sat, 08:00 - 16:00", desc: "Dokter anak yang berdedikasi tinggi untuk tumbuh kembang dan kesehatan balita.", rating: "5.0" },
    { id: 4, name: "Dr. James Brown", spec: "Orthopedics", initial: "JB", time: "Tue-Sat, 09:00 - 17:00", desc: "Spesialis bedah tulang dan cidera olahraga, ahli dalam penanganan rekonstruksi sendi.", rating: "4.7" },
    { id: 5, name: "Dr. Jennifer Davis", spec: "Neurology", initial: "JD", time: "Mon-Fri, 08:00 - 15:00", desc: "Menangani gangguan sistem saraf, otak, dan pengobatan migrain kronis.", rating: "4.9" },
    { id: 6, name: "Dr. Robert Miller", spec: "General Medicine", initial: "RM", time: "Mon-Fri, 09:00 - 18:00", desc: "Dokter umum untuk konsultasi kesehatan harian dan pemeriksaan fisik menyeluruh.", rating: "4.6" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header & Search */}
      <section className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            Cari <span className="text-blue-600">Dokter Spesialis</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Temukan tenaga medis profesional dan jadwalkan konsultasi Anda dengan mudah.
          </p>
        </div>
        
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-4 text-slate-400" size={22} />
          <input 
            type="text" 
            placeholder="Cari nama dokter atau spesialisasi..." 
            className="w-full p-4 pl-12 rounded-2xl border border-slate-200 bg-white shadow-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all text-slate-700" 
          />
        </div>
      </section>

      {/* Doctors List */}
      <div className="grid gap-6 pb-10">
        {doctors.map(doc => (
          <div key={doc.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:border-blue-100 transition-all group">
            <div className="flex items-start gap-6 w-full">
              {/* Avatar */}
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {doc.initial}
              </div>

              {/* Info */}
              <div className="space-y-2 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-xl text-slate-800">{doc.name}</h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-blue-100">
                    {doc.spec}
                  </span>
                  <div className="flex items-center gap-1 text-orange-400 ml-2">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-bold text-slate-600">{doc.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                  {doc.desc}
                </p>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-blue-500" /> {doc.time}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                    <MapPin size={14} className="text-blue-500" /> Gedung A, Lantai 3
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto shrink-0">
              <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                Pesan Jadwal <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookAppointment;
