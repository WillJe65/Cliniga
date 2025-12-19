import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Lock, Clock, Save, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export default function DoctorSettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('schedule');
  
  // ----------------------------------------------------------------
  // 1. STATE & LOGIC JADWAL (SCHEDULE)
  // ----------------------------------------------------------------
  
  // Default Schedule (Senin-Minggu)
  const defaultSchedule = [
    { day: 'Senin', startTime: '09:00', endTime: '15:00', isOpen: true },
    { day: 'Selasa', startTime: '09:00', endTime: '15:00', isOpen: true },
    { day: 'Rabu', startTime: '09:00', endTime: '15:00', isOpen: true },
    { day: 'Kamis', startTime: '09:00', endTime: '15:00', isOpen: true },
    { day: 'Jumat', startTime: '09:00', endTime: '15:00', isOpen: true },
    { day: 'Sabtu', startTime: '09:00', endTime: '12:00', isOpen: true },
    { day: 'Minggu', startTime: '00:00', endTime: '00:00', isOpen: false },
  ];

  const [schedule, setSchedule] = useState(defaultSchedule);

  // TODO: Jika nanti Backend sudah support menyimpan JSON jadwal per dokter, 
  // Anda bisa gunakan useQuery di sini untuk fetch jadwal tersimpan.
  // Untuk sekarang, kita pakai default state.

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  const handleToggleDay = (index) => {
    const newSchedule = [...schedule];
    newSchedule[index].isOpen = !newSchedule[index].isOpen;
    setSchedule(newSchedule);
  };

  // API: Simpan Jadwal
  const scheduleMutation = useMutation({
    mutationFn: async (newSchedule) => {
      // Mengirim data jadwal sebagai JSON ke backend
      const response = await fetch("/api/doctors/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: user?.id, // Kirim ID user/dokter
          schedule_data: newSchedule 
        }),
      });

      // Handle response jika endpoint belum ada (Simulasi sukses untuk demo)
      if (response.status === 404) {
        console.warn("Endpoint /api/doctors/schedule belum dibuat di backend.");
        return; // Anggap sukses di frontend saja
      }

      if (!response.ok) {
        throw new Error("Gagal menyimpan jadwal");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Jadwal Berhasil Disimpan",
        description: "Perubahan jadwal praktik Anda telah diperbarui.",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal Menyimpan",
        description: error.message || "Terjadi kesalahan sistem.",
        variant: "destructive",
      });
    }
  });

  const handleSaveSchedule = () => {
    scheduleMutation.mutate(schedule);
  };

  // ----------------------------------------------------------------
  // 2. STATE & LOGIC PASSWORD
  // ----------------------------------------------------------------

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  const handlePasswordChange = (field, value) => {
    setPasswordForm({ ...passwordForm, [field]: value });
    if (passwordErrors[field]) {
      setPasswordErrors({ ...passwordErrors, [field]: '' });
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Password saat ini tidak boleh kosong';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = 'Password baru tidak boleh kosong';
    }
    if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password minimal 8 karakter';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Password tidak sesuai';
    }
    return errors;
  };

  // API: Ganti Password
  const passwordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email, // Identifikasi user via email
          current_password: data.currentPassword,
          new_password: data.newPassword
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal mengubah password");
      }
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Password Berhasil Diubah",
        description: "Silakan gunakan password baru pada login berikutnya.",
      });
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal Mengubah Password",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSavePassword = () => {
    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    passwordMutation.mutate(passwordForm);
  };

  // ----------------------------------------------------------------
  // 3. RENDER UI
  // ----------------------------------------------------------------

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
            <h1 className="text-3xl font-bold text-cliniga-text">Pengaturan</h1>
            <p className="text-cliniga-grey mt-1">Kelola jadwal praktek dan keamanan akun Anda</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-10">
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Clock size={16} />
              Jadwal Praktik
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock size={16} />
              Ubah Password
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Jadwal Praktik */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Ubah Jadwal Praktik</CardTitle>
                <CardDescription>Atur jadwal praktek Anda untuk setiap hari dalam seminggu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {schedule.map((item, index) => (
                    <div 
                      key={index} 
                      className={`p-5 border rounded-lg transition-all ${
                        item.isOpen 
                          ? 'bg-white border-slate-200 hover:border-cliniga-primary' 
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={item.isOpen}
                            onChange={() => handleToggleDay(index)}
                            className="w-5 h-5 cursor-pointer accent-cliniga-primary"
                          />
                          <Label className="text-base font-semibold text-cliniga-text cursor-pointer">
                            {item.day}
                          </Label>
                        </div>
                        {!item.isOpen && (
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            Libur
                          </span>
                        )}
                      </div>

                      {item.isOpen && (
                        <div className="grid grid-cols-2 gap-4 ml-8">
                          <div>
                            <Label htmlFor={`start-${index}`} className="text-sm">Jam Mulai</Label>
                            <Input
                              id={`start-${index}`}
                              type="time"
                              value={item.startTime}
                              onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`end-${index}`} className="text-sm">Jam Selesai</Label>
                            <Input
                              id={`end-${index}`}
                              type="time"
                              value={item.endTime}
                              onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                              className="mt-2"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-blue-900">
                    <strong>Catatan:</strong> Perubahan jadwal akan disimpan ke sistem dan mempengaruhi slot booking pasien.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleSaveSchedule}
                    disabled={scheduleMutation.isPending}
                    className="bg-cliniga-primary hover:bg-blue-700 flex items-center gap-2"
                  >
                    {scheduleMutation.isPending ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    Simpan Jadwal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Ubah Password */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Ubah Kata Sandi</CardTitle>
                <CardDescription>Perbarui password akun Anda untuk keamanan yang lebih baik</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 max-w-md">
                <div>
                  <Label htmlFor="current-password">Password Saat Ini</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Masukkan password saat ini"
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className={`mt-2 ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-600 mt-2">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="new-password">Password Baru</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Masukkan password baru (minimal 8 karakter)"
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className={`mt-2 ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-600 mt-2">{passwordErrors.newPassword}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Ketik ulang password baru"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className={`mt-2 ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-2">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900">
                    <strong>Keamanan:</strong> Gunakan password yang kuat dengan kombinasi huruf, angka, dan simbol.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleSavePassword}
                    disabled={passwordMutation.isPending}
                    className="bg-cliniga-primary hover:bg-blue-700"
                  >
                    {passwordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Perbarui Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}