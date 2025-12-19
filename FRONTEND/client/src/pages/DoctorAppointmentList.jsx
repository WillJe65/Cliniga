import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, Filter, TrendingUp, CheckCircle, Clock, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from "@/context/AuthContext";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale"; 

export default function DoctorAppointmentList() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [doctorId, setDoctorId] = useState(null);

  // ----------------------------------------------------------------
  // 1. LOGIC: MENCARI DOCTOR ID DARI USER LOGIN
  // ----------------------------------------------------------------
  useEffect(() => {
    if (user?.role === 'doctor') {
      const profile = localStorage.getItem("cliniga_doctor_profile");
      if (profile) {
        try {
          const parsed = JSON.parse(profile);
          if (parsed.id) setDoctorId(parsed.id);
        } catch (e) {
          console.error("Error parsing doctor profile", e);
        }
      }
    }
  }, [user]);

  // Fallback: Jika di LocalStorage kosong, fetch list semua dokter dan cari nama yang cocok
  const { data: doctorsList } = useQuery({
    queryKey: ["/api/doctors"],
    enabled: user?.role === 'doctor' && !doctorId
  });

  useEffect(() => {
    if (doctorsList && user?.role === 'doctor' && !doctorId) {
      const myProfile = doctorsList.find((d) => d.name === user.name);
      if (myProfile) setDoctorId(myProfile.id);
    }
  }, [doctorsList, user, doctorId]);

  // ----------------------------------------------------------------
  // 2. FETCH DATA APPOINTMENT DARI API
  // ----------------------------------------------------------------
  const { data: responseData, isLoading } = useQuery({
    queryKey: [`/api/appointments/filter?doctor_id=${doctorId}`],
    enabled: !!doctorId, 
  });

  const appointments = responseData?.appointments || [];

  // ----------------------------------------------------------------
  // 3. HELPER FUNCTIONS (Status & Format)
  // ----------------------------------------------------------------
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'confirmed': return 'Masuk'; 
      case 'pending': return 'Menunggu';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  // Format Tanggal: "2025-12-18" -> "18 Des 2025"
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(parseISO(dateString), "d MMM yyyy", { locale: idLocale });
    } catch (e) {
      return dateString;
    }
  };

  // Format Jam: "09:00:00" -> "09:00"
  const formatTime = (timeString) => {
    if (!timeString) return "-";
    return timeString.substring(0, 5);
  };

  // Icon Status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={16} className="text-green-600" />;
      case 'confirmed': 
      case 'pending': return <Clock size={16} className="text-orange-600" />;
      case 'cancelled': return <XCircle size={16} className="text-red-600" />;
      default: return <AlertCircle size={16} className="text-slate-600" />;
    }
  };

  // Warna Status
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'confirmed': 
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  // ----------------------------------------------------------------
  // 4. STATISTIK & FILTERING CLIENT-SIDE
  // ----------------------------------------------------------------
  
  const stats = {
    total: appointments.length,
    selesai: appointments.filter(a => a.status === 'completed').length,
    masuk: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length,
    dibatalkan: appointments.filter(a => a.status === 'cancelled').length,
  };

  const filteredAppointments = appointments.filter(apt => {
    const searchLower = searchTerm.toLowerCase();
    
    // Pencarian bisa berdasarkan Nama Pasien, ID, atau Status
    const matchesSearch = 
      (apt.patient_name || "").toLowerCase().includes(searchLower) ||
      (apt.id.toString()).includes(searchLower) ||
      (getStatusLabel(apt.status)).toLowerCase().includes(searchLower);
    
    // Filter Tab
    switch(activeTab) {
      case 'selesai': return matchesSearch && apt.status === 'completed';
      case 'masuk': return matchesSearch && (apt.status === 'confirmed' || apt.status === 'pending');
      case 'dibatalkan': return matchesSearch && apt.status === 'cancelled';
      default: return matchesSearch;
    }
  });

  // ----------------------------------------------------------------
  // 5. RENDER UI
  // ----------------------------------------------------------------
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DoctorSidebar />

      <main className="flex-1 ml-72 px-12 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/dashboard">
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
                  <p className="text-3xl font-bold text-cliniga-text mt-2">
                    {isLoading ? "..." : stats.total}
                  </p>
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
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {isLoading ? "..." : stats.selesai}
                  </p>
                </div>
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-1 transition-transform border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Masuk / Menunggu</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {isLoading ? "..." : stats.masuk}
                  </p>
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
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {isLoading ? "..." : stats.dibatalkan}
                  </p>
                </div>
                <XCircle className="text-red-600" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointment List Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Daftar Lengkap Appointment</CardTitle>
                <CardDescription>
                  {isLoading ? "Memuat data..." : `Total: ${filteredAppointments.length} appointment`}
                </CardDescription>
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
                placeholder="Cari nama pasien, ID appointment..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cliniga-primary"
              />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="selesai">Selesai</TabsTrigger>
                <TabsTrigger value="masuk">Masuk</TabsTrigger>
                <TabsTrigger value="dibatalkan">Dibatalkan</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-y border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Nama Pasien</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Tanggal & Waktu</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isLoading ? (
                         <tr>
                           <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                             <div className="flex justify-center items-center gap-2">
                               <Loader2 className="animate-spin" /> Memuat data janji temu...
                             </div>
                           </td>
                         </tr>
                      ) : filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                            Tidak ada appointment yang ditemukan.
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((apt, index) => (
                          <tr key={index} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                              #{apt.id}
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-cliniga-text">
                                {apt.patient_name}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              <div className="flex flex-col">
                                <span>{formatDate(apt.appointment_date)}</span>
                                <span className="text-xs text-slate-500 font-medium">
                                  {formatTime(apt.appointment_time)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(apt.status)}`}>
                                {getStatusIcon(apt.status)}
                                {getStatusLabel(apt.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {/* Pastikan link ini mengarah ke page detail yang benar */}
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
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}