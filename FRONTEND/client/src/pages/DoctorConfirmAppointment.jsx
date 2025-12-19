import React, { useState } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation, Link } from 'wouter';
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Phone, Mail, Calendar, Stethoscope, FileText, Download, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from "@/lib/queryClient";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function DoctorConfirmAppointment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // 1. Ambil ID dari URL
  const [match, params] = useRoute("/doctor-confirm-appointment/:id");
  const appointmentId = params?.id;

  // 2. Fetch Detail Appointment dari API
  const { data: responseData, isLoading: isLoadingData } = useQuery({
    // Kita fetch endpoint utama lalu cari datanya di client-side
    queryKey: ["/api/appointments"], 
  });

  // Cari appointment yang sesuai ID
  const appointment = responseData?.appointments?.find(a => a.id.toString() === appointmentId);

  const [medicalRecord, setMedicalRecord] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    diagnosis: '',
    treatment: '',
    notes: '',
  });

  const handleMedicalRecordChange = (field, value) => {
    setMedicalRecord({ ...medicalRecord, [field]: value });
  };

  // 3. MUTATION: Update Status (Terima/Tolak/Selesai)
  const statusMutation = useMutation({
    mutationFn: async (newStatus) => {
      const response = await fetch("/api/appointments/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment_id: parseInt(appointmentId),
          status: newStatus 
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Gagal update status");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Status Diperbarui",
        description: `Status appointment berhasil diubah menjadi ${data.data.status}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal Update Status",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // 4. MUTATION: Simpan Rekam Medis
  const recordMutation = useMutation({
    mutationFn: async () => {
      const fullNotes = `
        Tensi: ${medicalRecord.bloodPressure} mmHg
        Nadi: ${medicalRecord.heartRate} bpm
        Suhu: ${medicalRecord.temperature} C
        BB/TB: ${medicalRecord.weight}kg / ${medicalRecord.height}cm
        ---
        Catatan Tambahan: ${medicalRecord.notes}
        Penanganan: ${medicalRecord.treatment}
      `;

      const response = await fetch("/api/medical-records/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment_id: parseInt(appointmentId),
          diagnosis: medicalRecord.diagnosis,
          notes: fullNotes
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan rekam medis");
      }
    },
    onSuccess: () => {
      statusMutation.mutate("completed");
      toast({
        title: "Rekam Medis Tersimpan",
        description: "Data medis pasien telah berhasil disimpan.",
      });
      setTimeout(() => setLocation('/doctor-appointment-list'), 1500);
    },
    onError: () => {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan rekam medis.",
        variant: "destructive",
      });
    }
  });

  const handleDownloadFile = () => {
    toast({
      title: "File sedang diunduh",
      description: "Fitur download file belum tersedia di demo ini.",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: idLocale });
    } catch { return dateString; }
  };

  const getStatusLabel = (status) => {
    switch (status) {
        case 'completed': return 'Selesai';
        case 'confirmed': return 'Masuk (Dikonfirmasi)';
        case 'pending': return 'Menunggu Konfirmasi';
        case 'cancelled': return 'Dibatalkan';
        default: return status;
    }
  };

  if (isLoadingData) {
      return <div className="flex h-screen items-center justify-center">
          <Loader2 className="animate-spin mr-2" /> Memuat data appointment...
      </div>;
  }

  if (!appointment) {
      return <div className="flex h-screen items-center justify-center flex-col">
          <p className="text-lg font-semibold text-slate-600">Appointment tidak ditemukan</p>
          <Link href="/doctor-appointment-list"><Button variant="link">Kembali</Button></Link>
      </div>;
  }

  const isRecordComplete = medicalRecord.bloodPressure && medicalRecord.diagnosis;
  const currentStatus = appointment.status;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DoctorSidebar />

      <main className="flex-1 ml-72 px-12 py-10">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/doctor-appointment-list">
            <Button variant="outline" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-cliniga-text">Konfirmasi Appointment</h1>
            <p className="text-cliniga-grey mt-1">ID: #{appointment.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} />
                  Data Pasien
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-6 pb-6 border-b">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-cliniga-primary text-2xl font-bold">
                    {appointment.patient_name ? appointment.patient_name.charAt(0).toUpperCase() : "P"}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-cliniga-text mb-1">{appointment.patient_name}</h3>
                    <p className="text-slate-600 text-sm mb-3">ID Pasien: #{appointment.patient_id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-slate-500">Nomor Telepon</Label>
                    <p className="mt-2 font-semibold text-cliniga-text flex items-center gap-2">
                      <Phone size={16} className="text-cliniga-primary" />
                      -
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Email</Label>
                    <p className="mt-2 font-semibold text-cliniga-text flex items-center gap-2">
                      <Mail size={16} className="text-cliniga-primary" />
                      -
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} />
                  Detail Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-xs text-slate-500">Tanggal</Label>
                    <p className="mt-2 font-semibold text-cliniga-text text-lg">
                        {formatDate(appointment.appointment_date)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Waktu</Label>
                    <p className="mt-2 font-semibold text-cliniga-text text-lg">
                        {appointment.appointment_time?.substring(0,5)}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">File Pendukung</p>
                        <p className="text-sm text-green-700">Tidak ada file terlampir</p>
                      </div>
                    </div>
                </div>
              </CardContent>
            </Card>

            {currentStatus === 'confirmed' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope size={20} />
                  Catatan Pemeriksaan
                </CardTitle>
                <CardDescription>Isi data pemeriksaan pasien untuk menyelesaikan kunjungan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="bp">Tekanan Darah (mmHg)</Label>
                    <Input id="bp" placeholder="120/80" value={medicalRecord.bloodPressure} onChange={(e) => handleMedicalRecordChange('bloodPressure', e.target.value)} className="mt-2"/>
                  </div>
                  <div>
                    <Label htmlFor="hr">Denyut Jantung (bpm)</Label>
                    <Input id="hr" placeholder="72" value={medicalRecord.heartRate} onChange={(e) => handleMedicalRecordChange('heartRate', e.target.value)} className="mt-2"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div>
                    <Label htmlFor="temp">Suhu (°C)</Label>
                    <Input id="temp" placeholder="36.5" value={medicalRecord.temperature} onChange={(e) => handleMedicalRecordChange('temperature', e.target.value)} className="mt-2"/>
                  </div>
                   <div>
                    <Label htmlFor="weight">Berat (kg)</Label>
                    <Input id="weight" placeholder="70" value={medicalRecord.weight} onChange={(e) => handleMedicalRecordChange('weight', e.target.value)} className="mt-2"/>
                  </div>
                </div>
                <div>
                  <Label htmlFor="height">Tinggi Badan (cm)</Label>
                  <Input id="height" placeholder="170" value={medicalRecord.height} onChange={(e) => handleMedicalRecordChange('height', e.target.value)} className="mt-2"/>
                </div>

                <div>
                  <Label htmlFor="diagnosis">Diagnosa *</Label>
                  <textarea
                    id="diagnosis"
                    placeholder="Masukkan diagnosa pasien..."
                    value={medicalRecord.diagnosis}
                    onChange={(e) => handleMedicalRecordChange('diagnosis', e.target.value)}
                    className="mt-2 w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cliniga-primary text-sm"
                    rows="3"
                  />
                </div>

                <div>
                  <Label htmlFor="treatment">Penanganan / Resep</Label>
                  <textarea
                    id="treatment"
                    placeholder="Resep obat atau tindakan..."
                    value={medicalRecord.treatment}
                    onChange={(e) => handleMedicalRecordChange('treatment', e.target.value)}
                    className="mt-2 w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cliniga-primary text-sm"
                    rows="3"
                  />
                </div>
                
                 <div>
                  <Label htmlFor="notes">Catatan Tambahan</Label>
                  <textarea
                    id="notes"
                    placeholder="Catatan lain..."
                    value={medicalRecord.notes}
                    onChange={(e) => handleMedicalRecordChange('notes', e.target.value)}
                    className="mt-2 w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cliniga-primary text-sm"
                    rows="2"
                  />
                </div>

                <Button
                  onClick={() => recordMutation.mutate()}
                  disabled={!isRecordComplete || recordMutation.isPending}
                  className="w-full bg-cliniga-primary hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  {recordMutation.isPending ? <Loader2 className="animate-spin" /> : <><Check size={18}/> Simpan Rekam Medis & Selesaikan</>}
                </Button>
              </CardContent>
            </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-10">
              <CardHeader>
                <CardTitle>Status Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-xs text-slate-500">Status Saat Ini</Label>
                  <div className={`mt-3 p-4 border-2 rounded-lg text-center font-bold text-lg
                      ${currentStatus === 'completed' ? 'bg-green-50 border-green-200 text-green-800' : 
                        currentStatus === 'cancelled' ? 'bg-red-50 border-red-200 text-red-800' :
                        'bg-yellow-50 border-yellow-200 text-yellow-900'}
                  `}>
                    {getStatusLabel(currentStatus)}
                  </div>
                </div>

                {currentStatus === 'pending' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700">
                      Konfirmasi kedatangan pasien agar form Rekam Medis terbuka.
                    </p>
                  </div>
                </div>
                )}

                {currentStatus === 'pending' && (
                  <div className="space-y-3">
                    <Button
                      onClick={() => statusMutation.mutate('confirmed')}
                      disabled={statusMutation.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Check size={18} />
                      {statusMutation.isPending ? 'Memproses...' : 'Konfirmasi Pasien Hadir'}
                    </Button>

                    <Button
                      onClick={() => statusMutation.mutate('cancelled')}
                      disabled={statusMutation.isPending}
                      variant="destructive"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Batalkan Janji
                    </Button>
                  </div>
                )}

                {currentStatus === 'confirmed' && (
                   <div className="space-y-3">
                      <p className="text-xs text-center text-slate-500 mb-2">Pasien sedang diperiksa...</p>
                       <Button
                        onClick={() => statusMutation.mutate('cancelled')}
                        disabled={statusMutation.isPending}
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Batalkan Kunjungan
                      </Button>
                   </div>
                )}

                {(currentStatus === 'completed' || currentStatus === 'cancelled') && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                    <p className="text-sm font-semibold text-slate-700">
                      Tidak ada tindakan lanjutan.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}