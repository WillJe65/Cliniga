import React, { useState } from 'react';
import { User, ShieldCheck, Mail, Phone, MapPin, KeyRound, Save, ChevronRight } from 'lucide-react';

export default function ProfileAccount() {
  const [showPass, setShowPass] = useState(false);
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header><h1 className="text-3xl font-bold text-slate-800 tracking-tight">Profil & <span className="text-blue-600">Pengaturan</span></h1></header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-slate-50"><div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-2xl uppercase">AS</div><div><h2 className="text-2xl font-bold text-slate-800">Alliyah Salsabilla</h2><p className="text-slate-400 font-medium flex items-center gap-1"><ShieldCheck size={14} className="text-green-500" /> Pasien Terverifikasi</p></div></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Mail size={12}/> Email Address</p><p className="font-semibold text-slate-700">alliyah.salsa@example.com</p></div>
            <div className="space-y-1"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Phone size={12}/> No. WhatsApp</p><p className="font-semibold text-slate-700">+62 812-3456-7890</p></div>
            <div className="space-y-1 md:col-span-2"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12}/> Alamat</p><p className="font-semibold text-slate-700">Jl. Melati No. 12, Bandar Lampung</p></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><KeyRound size={18} className="text-blue-600" /> Keamanan Akun</h3>
          <button onClick={() => setShowPass(!showPass)} className="w-full p-4 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition flex justify-between items-center">Ganti Kata Sandi <ChevronRight size={16} /></button>
          {showPass && (
            <div className="pt-4 space-y-3 border-t border-slate-50 animate-in fade-in duration-300">
              <input type="password" placeholder="Sandi Lama" className="w-full p-3 bg-slate-50 rounded-xl text-sm outline-none border border-transparent focus:border-blue-200" />
              <input type="password" placeholder="Sandi Baru" className="w-full p-3 bg-slate-50 rounded-xl text-sm outline-none border border-transparent focus:border-blue-200" />
              <button className="w-full p-3 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100"><Save size={16}/> Simpan</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}