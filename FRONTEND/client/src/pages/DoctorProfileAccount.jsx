import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Stethoscope, Mail, Phone, MapPin, Building } from 'lucide-react';
import { Link } from 'wouter';

export default function DoctorProfileAccount() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  
  // Sample doctor data
  const [doctorData] = useState({
    id: 'DOC-001',
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@cliniga.com',
    phone: '+62 812 3456 7890',
    specialization: 'Spesialis Jantung',
    licenseNumber: 'STR-12345/2020',
    hospital: 'Rumah Sakit Pusat Medika',
    experience: '12 Tahun',
    bio: 'Dokter berpengalaman dalam menangani penyakit jantung dan kardiovaskular dengan rekam jejak yang baik.'
  });

  const [medicalInfo] = useState({
    education: [
      {
        degree: 'Dokter (S1)',
        institution: 'Universitas Indonesia',
        year: 2012
      },
      {
        degree: 'Spesialis Jantung (S2)',
        institution: 'Universitas Gadjah Mada',
        year: 2015
      }
    ],
    certifications: [
      'Sertifikat ACLS (American Heart Association)',
      'Sertifikat BCLS (Basic Cardiac Life Support)',
      'Sertifikat ECG Interpretation'
    ],
    achievements: [
      'Best Doctor Award 2022',
      'Patient Choice Award 2023',
      'Medical Excellence Recognition 2024'
    ]
  });

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
            <h1 className="text-3xl font-bold text-cliniga-text">Profil Account</h1>
            <p className="text-cliniga-grey mt-1">Kelola informasi pribadi dan medis Anda</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-10">
            <TabsTrigger value="personal">Informasi Pemilik</TabsTrigger>
            <TabsTrigger value="medical">Informasi Medik</TabsTrigger>
          </TabsList>

          {/* Personal Account Information */}
          <TabsContent value="personal">
            <div className="grid gap-6">
              {/* Doctor Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Pribadi Dokter</CardTitle>
                  <CardDescription>Informasi dasar tentang Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Summary */}
                  <div className="flex items-start gap-6 pb-6 border-b">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-cliniga-primary text-3xl font-bold border-4 border-slate-50 shadow-sm">
                      {doctorData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-cliniga-text mb-2">{doctorData.name}</h3>
                      <p className="text-cliniga-primary font-semibold text-lg mb-3">{doctorData.specialization}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-cliniga-primary" />
                          {doctorData.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-cliniga-primary" />
                          {doctorData.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input id="name" defaultValue={doctorData.name} disabled className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={doctorData.email} disabled className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input id="phone" defaultValue={doctorData.phone} disabled className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="specialization">Spesialisasi</Label>
                      <Input id="specialization" defaultValue={doctorData.specialization} disabled className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="license">Nomor Lisensi</Label>
                      <Input id="license" defaultValue={doctorData.licenseNumber} disabled className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="experience">Pengalaman</Label>
                      <Input id="experience" defaultValue={doctorData.experience} disabled className="mt-2" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="hospital">Rumah Sakit / Klinik</Label>
                    <Input id="hospital" defaultValue={doctorData.hospital} disabled className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="bio">Biografi</Label>
                    <textarea 
                      id="bio" 
                      defaultValue={doctorData.bio} 
                      disabled 
                      className="mt-2 w-full p-3 border border-slate-200 rounded-lg text-sm"
                      rows="4"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button className="bg-cliniga-primary hover:bg-blue-700">Ubah Informasi</Button>
                    <Button variant="outline">Batal</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Medical Information */}
          <TabsContent value="medical">
            <div className="grid gap-6">
              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope size={20} />
                    Riwayat Pendidikan
                  </CardTitle>
                  <CardDescription>Pendidikan medis Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {medicalInfo.education.map((edu, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-lg">
                        <h4 className="font-semibold text-cliniga-text mb-1">{edu.degree}</h4>
                        <p className="text-sm text-slate-600 mb-2">{edu.institution}</p>
                        <p className="text-xs text-slate-500 font-semibold">Tahun {edu.year}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Sertifikasi & Lisensi</CardTitle>
                  <CardDescription>Sertifikasi profesional yang dimiliki</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {medicalInfo.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-cliniga-primary rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-slate-700">{cert}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Penghargaan & Prestasi</CardTitle>
                  <CardDescription>Penghargaan profesional yang telah diraih</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {medicalInfo.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-slate-700">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
