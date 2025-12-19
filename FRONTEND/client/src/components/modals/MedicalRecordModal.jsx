import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Pill, User, AlertCircle } from 'lucide-react';

const MedicalRecordModal = ({ isOpen, onClose, patient, onSubmit }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [resep, setResep] = useState('');

  // Mereset form saat modalnya dibuka
  useEffect(() => {
    if (isOpen) {
      setDiagnosis('');
      setResep('');
    }
  }, [isOpen, patient]);

  if (!isOpen || !patient) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(patient.id, { diagnosis, resep });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      
      {/* Container utamanya */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-white/50 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
          <div className="flex items-start gap-4">
            {/* Avatar Placeholder */}
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-cliniga-primary">
              <User size={28} />
            </div>

            {/* Detail pasien (ID & namanya terpisah ) */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 leading-tight">
                {patient.name}
              </h3>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-600 text-xs font-mono font-bold border border-slate-300">
                  {patient.id}
                </span>
                
                <span className="text-slate-400 text-xs">•</span>
                
                {/* Info umur */}
                <span className="text-sm text-slate-500 font-medium">
                  {patient.age} Tahun
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Area Scrollable */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          {/* Bagian Keluhan */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Keluhan Pasien
            </label>
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-start gap-3">
              <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  "{patient.complaint}"
                </p>
              </div>
            </div>
          </div>

          <form id="medical-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Input diagnoa */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                  <FileText size={16} />
                </div>
                Diagnosa Dokter
              </label>
              <textarea 
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Tuliskan hasil diagnosa medis di sini..."
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-slate-700 text-sm min-h-[120px] transition-all placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Input resep */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                 <div className="p-1.5 bg-green-100 text-green-600 rounded-lg">
                  <Pill size={16} />
                </div>
                Resep Obat & Tindakan
              </label>
              <textarea 
                required
                value={resep}
                onChange={(e) => setResep(e.target.value)}
                placeholder="Tuliskan resep obat atau tindakan lanjut..."
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-green-50 focus:border-green-500 outline-none text-slate-700 text-sm min-h-[120px] transition-all placeholder:text-slate-400 resize-none"
              />
            </div>
          </form>
        </div>

        {/* Footer tombol */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit"
            form="medical-form"
            className="px-6 py-3 bg-cliniga-primary text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Save size={18} />
            Simpan Rekam Medis
          </button>
        </div>

      </div>
    </div>
  );
};

export default MedicalRecordModal;
