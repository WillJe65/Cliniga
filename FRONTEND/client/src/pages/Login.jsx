import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { loginSchema } from "@shared/schema";
import { Stethoscope, User, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [step, setStep] = useState("role-selection"); // 'role-selection' atau 'login'

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "patient",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password, data.role);
      toast({
        title: "Selamat kembali!",
        description: "Anda berhasil masuk.",
      });
      // Redirect berdasarkan role
      if (data.role === "doctor") {
        setLocation("/doctor-dashboard");
      } else {
        setLocation("/patient-dashboard");
      }
    } catch (error) {
      toast({
        title: "Gagal masuk",
        description: error instanceof Error ? error.message : "Silakan periksa kredensial Anda dan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    form.setValue("role", role);
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    form.setValue("role", role);
    setStep("login");
  };

  const handleBackToRoleSelection = () => {
    setStep("role-selection");
    setSelectedRole(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Stethoscope className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-semibold">Cliniga</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {step === "role-selection" ? "Pilih Tipe Akun" : "Selamat Kembali"}
          </CardTitle>
          <CardDescription>
            {step === "role-selection"
              ? "Pilih apakah Anda seorang pasien atau dokter"
              : "Masuk ke akun Anda untuk melanjutkan"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* STEP 1: Role Selection */}
          {step === "role-selection" && (
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="h-auto w-full flex-col gap-4 border-2 py-6 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                onClick={() => handleSelectRole("patient")}
                data-testid="button-select-patient"
              >
                <User className="h-12 w-12 text-primary" />
                <div className="text-center">
                  <div className="font-semibold text-lg">Saya Pasien</div>
                  <div className="text-sm text-muted-foreground">
                    Cari dokter dan pesan janji temu
                  </div>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-auto w-full flex-col gap-4 border-2 py-6 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                onClick={() => handleSelectRole("doctor")}
                data-testid="button-select-doctor"
              >
                <Stethoscope className="h-12 w-12 text-primary" />
                <div className="text-center">
                  <div className="font-semibold text-lg">Saya Dokter</div>
                  <div className="text-sm text-muted-foreground">
                    Kelola jadwal dan pasien Anda
                  </div>
                </div>
              </Button>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Tidak punya akun? </span>
                <Link
                  href="/register"
                  className="font-medium text-primary hover:underline"
                  data-testid="link-register"
                >
                  Daftar
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: Login Form */}
          {step === "login" && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Masukkan email Anda"
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kata Sandi</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Masukkan kata sandi Anda"
                          {...field}
                          data-testid="input-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-submit-login"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Masuk sebagai {selectedRole === "doctor" ? "Dokter" : "Pasien"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleBackToRoleSelection}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Pilihan Akun
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {step === "login" && (
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Tidak punya akun? </span>
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
                data-testid="link-register"
              >
                Daftar
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Link
        href="/"
        className="mt-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke beranda
      </Link>
    </div>
  );
}
