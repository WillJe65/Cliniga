import React from 'react';
import { Search, Download, FileText, Calendar, User } from 'lucide-react';

export default function MedicalRecord() {
  const records = [
    { id: "REC-25-001", date: "15 Dec 2025", doctor: "Dr. Sarah Smith", diag: "Mild Hypertension", file: "Hasil_Lab.pdf" },
    { id: "REC-25-002", date: "01 Dec 2025", doctor: "Dr. Michael Johnson", diag: "Check-up Tahunan", file: "Resume_Medis.pdf" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Riwayat <span className="text-blue-600">Rekam Medis</span></h1>
        <p className="text-slate-400 mt-1">Daftar laporan kesehatan dan hasil konsultasi Anda.</p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input type="text" placeholder="Cari diagnosa atau dokter..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                <th className="px-8 py-4">Tanggal Periksa</th>
                <th className="px-8 py-4">Dokter & Spesialis</th>
                <th className="px-8 py-4">Diagnosa Akhir</th>
                <th className="px-8 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800">{rec.date}</p>
                    <p className="text-[10px] text-slate-400">{rec.id}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-semibold text-slate-700">{rec.doctor}</p>
                    <p className="text-xs text-slate-400 italic">Rumah Sakit Cliniga</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-full">{rec.diag}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}