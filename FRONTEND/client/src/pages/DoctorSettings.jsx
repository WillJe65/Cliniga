import React, { useState } from 'react';
import DoctorSidebar from '@/components/layout/DoctorSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Lock, Clock, Save, X } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function DoctorSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('schedule');
  
  // Schedule state
  const [schedule, setSchedule] = useState([
    { day: 'Senin', startTime: '09:00', endTime: '15:00', isOpen: true },
    { day: 'Selasa', startTime: '09:00', endTime: '15:00', isOpen: true },
    { day: 'Rabu', startTime: '09:00', endTime: '15:00', isOpen: true },
    { day: 'Kamis', startTime: '09:00', endTime: '15:00', isOpen: true },
    { day: 'Jumat', startTime: '09:00', endTime: '15:00', isOpen: true },
    { day: 'Sabtu', startTime: '09:00', endTime: '12:00', isOpen: true },
    { day: 'Minggu', startTime: '00:00', endTime: '00:00', isOpen: false },
  ]);

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({});

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

  const handleSaveSchedule = () => {
    toast({
      title: "Jadwal berhasil diperbarui",
      description: "Jadwal praktek Anda telah disimpan.",
    });
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm({ ...passwordForm, [field]: value });
    // Clear error for this field
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

  const handleSavePassword = () => {
    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    // Reset form
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    toast({
      title: "Password berhasil diubah",
      description: "Password Anda telah diperbarui dengan aman.",
    });
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

          {/* Schedule Management Tab */}
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
                            className="w-5 h-5 cursor-pointer"
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
                            <Label htmlFor={`start-${index}`} className="text-sm">
                              Jam Mulai
                            </Label>
                            <Input
                              id={`start-${index}`}
                              type="time"
                              value={item.startTime}
                              onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`end-${index}`} className="text-sm">
                              Jam Selesai
                            </Label>
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
                    <strong>Catatan:</strong> Pasien dapat membuat janji temu hanya pada jam-jam yang Anda buka. 
                    Perubahan jadwal akan berlaku segera setelah disimpan.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleSaveSchedule}
                    className="bg-cliniga-primary hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save size={18} />
                    Simpan Jadwal
                  </Button>
                  <Button variant="outline">Batal</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Change Tab */}
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
                    className="bg-cliniga-primary hover:bg-blue-700"
                  >
                    Perbarui Password
                  </Button>
                  <Button variant="outline">Batal</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
