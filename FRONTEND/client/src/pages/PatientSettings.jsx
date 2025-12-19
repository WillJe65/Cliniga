import React, { useState } from 'react';
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Lock, Bell, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import PatientSidebar from '@/components/layout/PatientSidebar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";

const PatientSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // MUTATION: GANTI PASSWORD
  const changePasswordMutation = useMutation({
    mutationFn: async (data) => {
      // Pastikan endpoint ini ada di backend (misal: auth.py)
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email, // Menggunakan email sebagai identifier
          current_password: data.currentPassword,
          new_password: data.newPassword
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal mengubah kata sandi");
      }
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Kata sandi Anda telah diperbarui.",
      });
      // Reset Form & Tutup
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowChangePassword(false);
    },
    onError: (error) => {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    
    // Validasi Client-Side
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Validasi Gagal",
        description: "Konfirmasi kata sandi baru tidak cocok.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Validasi Gagal",
        description: "Kata sandi harus minimal 6 karakter.",
        variant: "destructive"
      });
      return;
    }

    // Kirim ke Backend
    changePasswordMutation.mutate(passwordData);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <PatientSidebar />
      <div className="flex-1">
        <div className="max-w-3xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href="/patient-dashboard">
              <a className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-semibold">
                <ArrowLeft size={18} />
                Kembali ke Dasbor
              </a>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Pengaturan Akun</h1>
            <p className="text-gray-600 mt-2">Kelola preferensi dan keamanan akun Anda</p>
          </div>

          {/* Settings Cards */}
          <div className="space-y-6">
            {/* Notification Settings (Mock UI - Belum ada endpoint spesifik) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Pemberitahuan</h3>
                    <p className="text-sm text-gray-600">Kelola pengaturan pemberitahuan Anda</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label className="text-sm font-semibold text-gray-700">Pemberitahuan Email</label>
                  <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer accent-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label className="text-sm font-semibold text-gray-700">Pemberitahuan Janji Temu</label>
                  <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer accent-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label className="text-sm font-semibold text-gray-700">Pemberitahuan Hasil Medis</label>
                  <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer accent-blue-600" />
                </div>
              </div>
            </div>

            {/* Password Settings */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Keamanan Kata Sandi</h3>
                    <p className="text-sm text-gray-600">Ubah kata sandi Anda secara berkala</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-100 transition"
                >
                  {showChangePassword ? 'Batal' : 'Ubah Kata Sandi'}
                </button>
              </div>

              {/* Change Password Form */}
              {showChangePassword && (
                <form onSubmit={handleSubmitPassword} className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kata Sandi Saat Ini
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Masukkan kata sandi saat ini"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Masukkan kata sandi baru"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Konfirmasi Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Konfirmasi kata sandi baru"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={changePasswordMutation.isPending}
                      className="w-full mt-6 px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      {changePasswordMutation.isPending ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          Memproses...
                        </>
                      ) : (
                        'Simpan Kata Sandi Baru'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Account Info (Read-Only dari User Context) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Informasi Akun</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Nama</p>
                  <p className="text-sm text-gray-900 font-semibold">{user?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                  <p className="text-sm text-gray-900 font-semibold">{user?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Peran</p>
                  <p className="text-sm text-gray-900 font-semibold capitalize">Pasien</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSettings;