import React, { useState } from 'react';
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocation } from 'wouter';
import { ArrowLeft, User, Phone, Mail, Calendar, Stethoscope, FileText, Download, Check, X, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function DoctorConfirmAppointment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get appointment ID from URL (would normally come from params)
  const appointmentId = '#APT-001';

  // Sample appointment data
  const [appointment] = useState({
    id: appointmentId,
    patientId: '#P-001',
    patientName: 'Budi Santoso',
    age: 45,
    gender: 'Laki-laki',
    phone: '+62 812 3456 7890',
    email: 'budi.santoso@email.com',
    date: '18 Des 2025',
    time: '09:00',
    status: 'Menunggu',
    complaint: 'Nyeri Dada Kiri',
    file: 'resep_obat.pdf',
    history: 'Pasien memiliki riwayat tekanan darah tinggi dan pernah dirawat tahun 2020.',
  });

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

  const [appointmentStatus, setAppointmentStatus] = useState(appointment.status);
  const [isLoading, setIsLoading] = useState(false);

  const handleMedicalRecordChange = (field, value) => {
    setMedicalRecord({ ...medicalRecord, [field]: value });
  };

  const handleDownloadFile = () => {
    toast({
      title: "File sedang diunduh",
      description: `${appointment.file} sedang diunduh...`,
    });
    // In real app, would trigger download
  };

  const handleSaveMedicalRecord = async () => {
    if (!medicalRecord.diagnosis) {
      toast({
        title: "Validasi Gagal",
        description: "Diagnosa harus diisi terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Rekam Medis Disimpan",
        description: `Rekam medis pasien ${appointment.patientName} berhasil disimpan.`,
      });

      // Auto update status to Done when record is saved
      if (appointmentStatus !== 'Selesai') {
        setAppointmentStatus('Selesai');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      setAppointmentStatus(newStatus);
      const statusLabel = newStatus === 'Selesai' ? 'Selesai' : 'Dibatalkan';
      toast({
        title: `Status Updated`,
        description: `Appointment status diubah menjadi ${statusLabel}`,
      });

      // Redirect back after a short delay
      setTimeout(() => {
        setLocation('/doctor-incoming-appointments');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const isRecordComplete = medicalRecord.bloodPressure && medicalRecord.diagnosis;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DoctorSidebar />

      <main className="flex-1 ml-72 px-12 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/doctor-incoming-appointments">
            <Button variant="outline" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-cliniga-text">Konfirmasi Appointment</h1>
            <p className="text-cliniga-grey mt-1">ID: {appointment.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Patient Info & Appointment Details */}
          <div className="col-span-2 space-y-6">
            {/* Patient Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} />
                  Data Pasien
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Patient Profile */}
                <div className="flex items-start gap-6 pb-6 border-b">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-cliniga-primary text-2xl font-bold">
                    {appointment.patientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-cliniga-text mb-1">{appointment.patientName}</h3>
                    <p className="text-slate-600 text-sm mb-3">ID: {appointment.patientId}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 text-xs">Umur</span>
                        <p className="font-semibold text-cliniga-text">{appointment.age} tahun</p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs">Jenis Kelamin</span>
                        <p className="font-semibold text-cliniga-text">{appointment.gender}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-slate-500">Nomor Telepon</Label>
                    <p className="mt-2 font-semibold text-cliniga-text flex items-center gap-2">
                      <Phone size={16} className="text-cliniga-primary" />
                      {appointment.phone}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Email</Label>
                    <p className="mt-2 font-semibold text-cliniga-text flex items-center gap-2">
                      <Mail size={16} className="text-cliniga-primary" />
                      {appointment.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Details */}
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
                    <p className="mt-2 font-semibold text-cliniga-text text-lg">{appointment.date}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Waktu</Label>
                    <p className="mt-2 font-semibold text-cliniga-text text-lg">{appointment.time}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-slate-500">Keluhan Utama</Label>
                  <p className="mt-2 font-semibold text-cliniga-text text-base">{appointment.complaint}</p>
                </div>

                <div>
                  <Label className="text-xs text-slate-500">Riwayat Medis</Label>
                  <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-slate-700">{appointment.history}</p>
                  </div>
                </div>

                {/* File Section */}
                {appointment.file && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">File dari Pasien</p>
                        <p className="text-sm text-green-700">{appointment.file}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadFile}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} />
                      Unduh
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Medical Record Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope size={20} />
                  Catatan Pemeriksaan
                </CardTitle>
                <CardDescription>Isi data pemeriksaan pasien</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="bp">Tekanan Darah (mmHg)</Label>
                    <Input
                      id="bp"
                      placeholder="120/80"
                      value={medicalRecord.bloodPressure}
                      onChange={(e) => handleMedicalRecordChange('bloodPressure', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hr">Denyut Jantung (bpm)</Label>
                    <Input
                      id="hr"
                      placeholder="72"
                      value={medicalRecord.heartRate}
                      onChange={(e) => handleMedicalRecordChange('heartRate', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="temp">Suhu Tubuh (°C)</Label>
                    <Input
                      id="temp"
                      placeholder="36.5"
                      value={medicalRecord.temperature}
                      onChange={(e) => handleMedicalRecordChange('temperature', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Berat Badan (kg)</Label>
                    <Input
                      id="weight"
                      placeholder="70"
                      value={medicalRecord.weight}
                      onChange={(e) => handleMedicalRecordChange('weight', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="height">Tinggi Badan (cm)</Label>
                  <Input
                    id="height"
                    placeholder="170"
                    value={medicalRecord.height}
                    onChange={(e) => handleMedicalRecordChange('height', e.target.value)}
                    className="mt-2"
                  />
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
                  <Label htmlFor="treatment">Penanganan / Pengobatan</Label>
                  <textarea
                    id="treatment"
                    placeholder="Uraikan penanganan yang diberikan..."
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
                    placeholder="Catatan atau rekomendasi lainnya..."
                    value={medicalRecord.notes}
                    onChange={(e) => handleMedicalRecordChange('notes', e.target.value)}
                    className="mt-2 w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cliniga-primary text-sm"
                    rows="2"
                  />
                </div>

                <Button
                  onClick={handleSaveMedicalRecord}
                  disabled={!isRecordComplete || isLoading}
                  className="w-full bg-cliniga-primary hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Rekam Medis & Tandai Selesai'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Status & Actions */}
          <div>
            {/* Status Card */}
            <Card className="sticky top-10">
              <CardHeader>
                <CardTitle>Status Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Status */}
                <div>
                  <Label className="text-xs text-slate-500">Status Saat Ini</Label>
                  <div className="mt-3 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                    <p className="text-center font-bold text-yellow-900 text-lg">{appointmentStatus}</p>
                  </div>
                </div>

                {/* Status Info */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700">
                      Simpan rekam medis untuk menandai appointment sebagai <strong>Selesai</strong>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {appointmentStatus !== 'Selesai' && appointmentStatus !== 'Dibatalkan' && (
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleUpdateStatus('Selesai')}
                      disabled={isLoading}
                      className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <Check size={18} />
                      {isLoading ? 'Memproses...' : 'Tandai Selesai'}
                    </Button>

                    <Button
                      onClick={() => handleUpdateStatus('Dibatalkan')}
                      disabled={isLoading}
                      variant="destructive"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      {isLoading ? 'Memproses...' : 'Batalkan'}
                    </Button>
                  </div>
                )}

                {(appointmentStatus === 'Selesai' || appointmentStatus === 'Dibatalkan') && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                    <p className="text-sm font-semibold text-slate-700">
                      Appointment telah {appointmentStatus === 'Selesai' ? 'diselesaikan' : 'dibatalkan'}
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
