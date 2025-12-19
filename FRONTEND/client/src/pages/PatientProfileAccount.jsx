import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, ArrowLeft, Settings } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import PatientSidebar from '@/components/layout/PatientSidebar';

const PatientProfileAccount = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Alliyah Salsabilla',
    email: user?.email || 'alliyah@example.com',
    phone: '08123456789',
    address: 'Jl. Merdeka No. 123, Jakarta Selatan',
    dateOfBirth: '1995-08-15',
    bloodType: 'O+',
    emergencyContact: '08987654321',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // TODO: Save to backend
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <PatientSidebar />
      <div className="flex-1">
        <div className="max-w-2xl mx-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/patient-dashboard">
                <a className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-semibold">
                  <ArrowLeft size={18} />
                  Kembali ke Dashboard
                </a>
              </Link>
              <h2 className="text-2xl font-bold text-gray-900">Profil Akun</h2>
            </div>
            <div className="flex flex-col gap-2">
              {!isEditing && (
                <>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit Profil
                  </button>
                  <Link href="/patient-settings">
                    <a className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300 transition flex items-center gap-2 justify-center">
                      <Settings size={16} />
                      Pengaturan
                    </a>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            {/* Profile Header */}
            <div className="flex items-center gap-6 pb-8 border-b border-gray-100 mb-8">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
                {formData.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{formData.name}</h3>
                <p className="text-gray-500 text-sm">{formData.email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User size={16} />
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Telepon */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={16} />
                    No. Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Golongan Darah */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Golongan Darah
                  </label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                {/* Kontak Darurat */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Kontak Darurat
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Alamat (Full Width) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin size={16} />
                  Alamat
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 bg-white text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Simpan Perubahan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileAccount;
