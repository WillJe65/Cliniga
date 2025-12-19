import React, { useState } from 'react';
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, Filter, TrendingUp, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function DoctorAppointmentList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Sample appointment data
  const [appointments] = useState([
    { id: '#APT-001', patientName: 'Budi Santoso', time: '09:00', date: '18 Des 2025', status: 'Selesai', complaint: 'Nyeri Dada' },
    { id: '#APT-002', patientName: 'Siti Aminah', time: '09:30', date: '18 Des 2025', status: 'Masuk', complaint: 'Sesak Nafas' },
    { id: '#APT-003', patientName: 'Rudi Hermawan', time: '10:00', date: '18 Des 2025', status: 'Selesai', complaint: 'Check-up Rutin' },
    { id: '#APT-004', patientName: 'Linda Kusuma', time: '10:30', date: '18 Des 2025', status: 'Masuk', complaint: 'Tekanan Darah Tinggi' },
    { id: '#APT-005', patientName: 'Ahmad Dahlan', time: '11:00', date: '18 Des 2025', status: 'Dibatalkan', complaint: 'Reschedule' },
    { id: '#APT-006', patientName: 'Maria Garcia', time: '14:00', date: '19 Des 2025', status: 'Masuk', complaint: 'Konsultasi Umum' },
    { id: '#APT-007', patientName: 'Yuki Tanaka', time: '14:30', date: '19 Des 2025', status: 'Selesai', complaint: 'Follow-up' },
  ]);

  // Calculate statistics
  const stats = {
    total: appointments.length,
    selesai: appointments.filter(a => a.status === 'Selesai').length,
    masuk: appointments.filter(a => a.status === 'Masuk').length,
    dibatalkan: appointments.filter(a => a.status === 'Dibatalkan').length,
  };

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.complaint.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch(activeTab) {
      case 'selesai': return matchesSearch && apt.status === 'Selesai';
      case 'masuk': return matchesSearch && apt.status === 'Masuk';
      case 'dibatalkan': return matchesSearch && apt.status === 'Dibatalkan';
      default: return matchesSearch;
    }
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Selesai': return <CheckCircle size={16} className="text-green-600" />;
      case 'Masuk': return <Clock size={16} className="text-orange-600" />;
      case 'Dibatalkan': return <XCircle size={16} className="text-red-600" />;
      default: return <AlertCircle size={16} className="text-slate-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Selesai': return 'bg-green-100 text-green-700 border-green-200';
      case 'Masuk': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Dibatalkan': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
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
            <h1 className="text-3xl font-bold text-cliniga-text">Daftar Appointment</h1>
            <p className="text-cliniga-grey mt-1">Lihat semua janji temu pasien Anda</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <Card className="hover:-translate-y-1 transition-transform">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Appointment</p>
                  <p className="text-3xl font-bold text-cliniga-text mt-2">{stats.total}</p>
                </div>
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-1 transition-transform border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Selesai</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.selesai}</p>
                </div>
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-1 transition-transform border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Masuk</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{stats.masuk}</p>
                </div>
                <Clock className="text-orange-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-1 transition-transform border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Dibatalkan</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stats.dibatalkan}</p>
                </div>
                <XCircle className="text-red-600" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointment List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Daftar Lengkap Appointment</CardTitle>
                <CardDescription>Total: {filteredAppointments.length} appointment</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter size={18} />
                Filter
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Search Bar */}
            <div className="mb-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Cari nama pasien, ID appointment, atau keluhan..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cliniga-primary"
              />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">Semua ({stats.total})</TabsTrigger>
                <TabsTrigger value="selesai">Selesai ({stats.selesai})</TabsTrigger>
                <TabsTrigger value="masuk">Masuk ({stats.masuk})</TabsTrigger>
                <TabsTrigger value="dibatalkan">Dibatalkan ({stats.dibatalkan})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-y border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Nama Pasien</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Tanggal & Waktu</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Keluhan</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAppointments.map((apt, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600">{apt.id}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-cliniga-text">{apt.patientName}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            <div className="flex flex-col">
                              <span>{apt.date}</span>
                              <span className="text-xs text-slate-500 font-medium">{apt.time}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700">{apt.complaint}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(apt.status)}`}>
                              {getStatusIcon(apt.status)}
                              {apt.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link href={`/doctor-confirm-appointment/${apt.id}`}>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-sm"
                              >
                                Lihat Detail
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredAppointments.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-500 font-medium">Tidak ada appointment ditemukan</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
