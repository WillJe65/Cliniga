import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

// Kita pisahkan penyimpanan Data User dan Token JWT
const USER_STORAGE_KEY = "cliniga_user";
const TOKEN_STORAGE_KEY = "cliniga_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Load data saat aplikasi dibuka (Refresh)
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Jika data corrupt, bersihkan semua
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // 2. Fungsi Login
  const login = async (email, password, role) => {
    // Kirim request ke Backend Python
    // Note: Backend tidak butuh 'role' di body, dia cek user by email saja.
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), 
    });

    const data = await response.json();

    // Cek Error (Python mengirim key 'error', bukan 'message')
    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    // VALIDASI ROLE DI FRONTEND (Security UX)
    // Pastikan pasien tidak masuk lewat pintu login dokter
    if (data.user.role !== role) {
      throw new Error(`Akun ini terdaftar sebagai ${data.user.role}, mohon login di menu yang sesuai.`);
    }

    // Simpan ke State
    setUser(data.user);

    // Simpan ke LocalStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token); // Simpan Token JWT

    // Jika ada profile dokter (opsional), bisa disimpan juga
    if (data.doctor_profile) {
      localStorage.setItem("cliniga_doctor_profile", JSON.stringify(data.doctor_profile));
    }
  };

  // 3. Fungsi Register
  const register = async (name, email, password, role) => {
    const payload = { name, email, password, role };
    
    // Sedikit trik: Jika dokter daftar, beri nilai default agar backend tidak error
    if (role === 'doctor') {
        payload.specialization = "Umum";
        payload.schedule = "Senin-Jumat";
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    // PENTING: Backend Python Register TIDAK auto-login (tidak return token).
    // Jadi JANGAN panggil setUser(data) di sini.
    // Biarkan UI me-redirect user ke halaman login.
  };

  // 4. Fungsi Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem("cliniga_doctor_profile");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}