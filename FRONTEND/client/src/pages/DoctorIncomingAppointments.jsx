import React, { useState } from 'react';
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, Clock, User, Stethoscope, FileText, ChevronRight, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function DoctorIncomingAppointments() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample incoming appointments data
  const [appointments] = useState([
    {
      id: '#APT-001',
      patientName: 'Budi Santoso',
      age: 45,
      time: '09:00',
      status: 'Menunggu',
      complaint: 'Nyeri Dada Kiri',
      file: 'resep_obat.pdf',
      hasFile: true,
    },
    {
      id: '#APT-002',
      patientName: 'Siti Aminah',
      age: 32,
      time: '09:30',
      status: 'Menunggu',
      complaint: 'Sesak Nafas',
      file: null,
      hasFile: false,
    },
    {
      id: '#APT-004',
      patientName: 'Linda Kusuma',
      age: 55,
      time: '10:30',
      status: 'Diperiksa',
      complaint: 'Tekanan Darah Tinggi',
      file: 'lab_report.pdf',
      hasFile: true,
    },
    {
      id: '#APT-006',
      patientName: 'Maria Garcia',
      age: 38,
      time: '14:00',
      status: 'Menunggu',
      complaint: 'Konsultasi Umum',
      file: null,
      hasFile: false,
    },
  ]);

  // Filter appointments based on search
  const filteredAppointments = appointments.filter(apt =>
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.complaint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Diperiksa':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Menunggu':
        return <Clock size={16} className="text-yellow-600" />;
      case 'Diperiksa':
        return <AlertCircle size={16} className="text-blue-600" />;
      default:
        return <Clock size={16} className="text-slate-600" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DoctorSidebar />

      <main className="flex-1 ml-72 px-12 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/doctor-dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-cliniga-text">Appointment Masuk</h1>
            <p className="text-cliniga-grey mt-1">Kelola janji temu pasien yang masuk hari ini</p>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="bg-blue-50 border-blue-200 mb-8">
          <CardContent className="pt-6 flex items-start gap-4">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-blue-900">Total Appointment Masuk: {filteredAppointments.length}</p>
              <p className="text-sm text-blue-700 mt-1">Klik pada setiap appointment untuk melihat detail dan mengubah status.</p>
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari nama pasien, ID appointment, atau keluhan..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cliniga-primary"
          />
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((apt, index) => (
            <Link key={index} href={`/doctor-confirm-appointment/${apt.id}`}>
              <Card className="hover:shadow-lg hover:border-cliniga-primary transition-all cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-6">
                    {/* Left Section - Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User size={24} className="text-cliniga-primary" />
                        </div>

                        {/* Patient Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-cliniga-text">{apt.patientName}</h3>
                            <span className="text-sm text-slate-500">({apt.age} tahun)</span>
                          </div>

                          <div className="grid grid-cols-3 gap-6 mb-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock size={16} className="text-slate-400" />
                              <div>
                                <p className="text-xs text-slate-500">Waktu</p>
                                <p className="font-semibold text-cliniga-text">{apt.time}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Stethoscope size={16} className="text-slate-400" />
                              <div>
                                <p className="text-xs text-slate-500">Keluhan</p>
                                <p className="font-semibold text-cliniga-text">{apt.complaint}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <span className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-flex items-center gap-2 ${getStatusBadge(apt.status)}`}>
                                {getStatusIcon(apt.status)}
                                {apt.status}
                              </span>
                            </div>
                          </div>

                          {/* Appointment ID */}
                          <p className="text-xs text-slate-500">ID: {apt.id}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - File & Action */}
                    <div className="flex flex-col items-end gap-4">
                      {/* File Info */}
                      {apt.hasFile ? (
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                          <FileText size={16} className="text-green-600" />
                          <div className="text-sm">
                            <p className="font-semibold text-green-900">File Tersedia</p>
                            <p className="text-xs text-green-700">{apt.file}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                          <FileText size={16} className="text-slate-400" />
                          <p className="text-sm text-slate-600">Tidak ada file</p>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button className="bg-cliniga-primary hover:bg-blue-700 flex items-center gap-2">
                        <span>Lihat Detail</span>
                        <ChevronRight size={18} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <Card className="text-center py-16">
            <div className="flex flex-col items-center justify-center gap-4">
              <AlertCircle size={48} className="text-slate-300" />
              <div>
                <p className="text-lg font-semibold text-slate-600">Tidak ada appointment masuk</p>
                <p className="text-sm text-slate-500 mt-2">Semua appointment Anda telah diproses</p>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
