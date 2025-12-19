import React, { useState } from 'react';
import { FileText, Download, Eye, ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'wouter';
import PatientSidebar from '@/components/layout/PatientSidebar';

const PatientMedicalRecord = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const records = [
    {
      id: 1,
      doctor: "Dr. Sarah Smith",
      specialty: "Cardiology",
      date: "15 Dec 2025",
      diagnosis: "Tekanan darah tinggi",
      treatment: "Resep obat hipertensi",
      notes: "Pasien disarankan untuk mengurangi asupan garam dan melakukan olahraga teratur.",
      medicines: ["Lisinopril 10mg", "Amlodipine 5mg"]
    },
    {
      id: 2,
      doctor: "Dr. Michael Johnson",
      specialty: "Dermatology",
      date: "10 Dec 2025",
      diagnosis: "Dermatitis kontak",
      treatment: "Salep kortikosteroid topical",
      notes: "Hindari kontak dengan alergen. Gunakan salep 2x sehari selama 2 minggu.",
      medicines: ["Triamcinolone Acetonide 0.1% Cream"]
    },
    {
      id: 3,
      doctor: "Dr. Sarah Smith",
      specialty: "Cardiology",
      date: "05 Dec 2025",
      diagnosis: "Check-up rutin",
      treatment: "Lanjutkan gaya hidup sehat",
      notes: "Hasil pemeriksaan normal. Lanjutkan gaya hidup sehat dan kontrol berkala.",
      medicines: []
    }
  ];

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleDownload = (record) => {
    alert(`Mengunduh rekam medis dari ${record.doctor}...`);
    // TODO: Implement actual download functionality
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <PatientSidebar />
      <div className="flex-1">
        <div className="max-w-5xl mx-auto p-8">
          <div className="mb-8">
            <Link href="/patient-dashboard">
              <a className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-semibold">
                <ArrowLeft size={18} />
                Kembali ke Dashboard
              </a>
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900">Riwayat Medis</h2>
                <p className="text-gray-600">Catatan medis Anda disimpan dengan aman dan hanya dapat diakses oleh Anda.</p>
              </div>
              <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2 text-sm font-semibold">
                <Lock size={16} />
                Read-Only
              </div>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Tidak ada rekam medis</h3>
              <p className="text-gray-600 mt-2">Rekam medis akan muncul setelah Anda melakukan konsultasi dengan dokter</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map(record => (
                <div key={record.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText size={24} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{record.doctor}</h3>
                          <p className="text-xs text-gray-500 mt-1">{record.specialty}</p>
                          <p className="text-xs text-gray-400 mt-2">{record.date}</p>
                        </div>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                          Terverifikasi
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">Diagnosa:</p>
                          <p className="text-sm text-gray-700">{record.diagnosis}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">Tindakan/Resep:</p>
                          <p className="text-sm text-gray-700">{record.treatment}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button 
                          onClick={() => handleViewDetail(record)}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition flex items-center gap-2"
                        >
                          <Eye size={14} />
                          Lihat Detail
                        </button>
                        <button 
                          onClick={() => handleDownload(record)}
                          className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-100 transition flex items-center gap-2"
                        >
                          <Download size={14} />
                          Unduh PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Information Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">💡 Informasi Penting</h3>
            <p className="text-sm text-blue-800">
              Catatan medis ini bersifat <strong>read-only</strong> (hanya dapat dibaca). Hanya dokter yang berwenang yang dapat menambahkan atau mengubah informasi medis. Jika Anda menemukan kesalahan dalam data, silakan hubungi dokter yang bersangkutan.
            </p>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedRecord.doctor}</h2>
                <p className="text-gray-600">{selectedRecord.specialty}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Date */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Tanggal Pemeriksaan</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRecord.date}</p>
              </div>

              {/* Diagnosis */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Diagnosa</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-900">{selectedRecord.diagnosis}</p>
                </div>
              </div>

              {/* Treatment */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Tindakan/Resep</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-gray-900">{selectedRecord.treatment}</p>
                </div>
              </div>

              {/* Medicines */}
              {selectedRecord.medicines.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Obat-obatan</p>
                  <div className="space-y-2">
                    {selectedRecord.medicines.map((medicine, idx) => (
                      <div key={idx} className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span className="text-gray-900">{medicine}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Catatan Dokter</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-900">{selectedRecord.notes}</p>
                </div>
              </div>

              {/* Read-Only Notice */}
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-700 font-semibold">
                  <Lock size={16} />
                  Dokumen ini bersifat read-only
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition"
              >
                Tutup
              </button>
              <button
                onClick={() => handleDownload(selectedRecord)}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientMedicalRecord;
