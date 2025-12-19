import { useState, useEffect } from 'react';
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Stethoscope,
  Calendar,
  Shield,
  Clock,
  Users,
  CalendarCheck,
  Building2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Carousel from "@/components/common/Carousel";
import InteractiveDoctorCard from "@/components/doctors/InteractiveDoctorCard";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const stats = [
  { icon: Users, value: "500+", label: "Dokter Berkualifikasi" },
  { icon: CalendarCheck, value: "10,000+", label: "Janji Temu Dipesan" },
  { icon: Building2, value: "50+", label: "Spesialisasi" },
  { icon: Clock, value: "24/7", label: "Dukungan Tersedia" },
];

const howItWorks = [
  {
    step: 1,
    title: "Temukan Dokter Anda",
    description:
      "Jelajahi daftar dokter berkualifikasi kami dan temukan spesialis yang tepat untuk kebutuhan Anda.",
    icon: Stethoscope,
  },
  {
    step: 2,
    title: "Pesan Janji Temu",
    description:
      "Pilih tanggal dan waktu yang nyaman sesuai jadwal Anda.",
    icon: Calendar,
  },
  {
    step: 3,
    title: "Dapatkan Perawatan",
    description:
      "Kunjungi klinik dan terima layanan kesehatan berkualitas dengan catatan medis Anda disimpan dengan aman.",
    icon: Shield,
  },
];

export default function Landing() {
  // 1. FETCH DATA DARI API
  const { data: apiDoctors = [] } = useQuery({
    queryKey: ["/api/doctors"],
  });

  // 2. DATA MAPPING (PENTING!)
  // Karena backend belum mengirim image/rating, kita beri default agar UI Landing Page tetap cantik.
  const doctors = apiDoctors.map(doc => ({
    ...doc,
    // Gunakan gambar random dari Unsplash jika backend tidak ada gambar
    image: doc.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop", 
    rating: doc.rating || 4.8, 
    reviewCount: doc.reviewCount || 120,
    location: doc.location || "Jakarta Pusat",
    hospital: doc.hospital || "RS Cliniga Utama"
  }));

  // Ambil 3 dokter pertama untuk Featured Section
  const featuredDoctors = doctors.slice(0, 3);
  
  const [scrollY, setScrollY] = useState(0);

  // Track scroll position untuk parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation untuk stat cards
  const { elementRef: statsRef, isVisible: statsVisible } = useIntersectionObserver();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION dengan parallax effect */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 min-h-[90vh] sm:min-h-[80vh] md:min-h-screen flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/5 rounded-full blur-3xl"
            style={{ transform: `translateY(${-scrollY * 0.3}px)` }}
          />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 w-full">
          <div className="mx-auto max-w-3xl text-center">
            <div
              className="inline-block animate-fade-in-down"
              style={{
                animation: 'fadeInDown 0.8s ease-out forwards',
              }}
            >
              <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
                ✨ Platform Kesehatan Terpercaya
              </Badge>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight sm:leading-snug md:leading-snug lg:leading-tight transition-transform duration-700 hover:scale-105"
              data-testid="text-hero-title"
              style={{
                animation: 'fadeInUp 1s ease-out 0.2s both',
              }}
            >
              Kesehatan Anda,{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Prioritas Kami
              </span>
            </h1>

            <p
              className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed"
              style={{
                animation: 'fadeInUp 1s ease-out 0.4s both',
              }}
            >
              Pesan janji temu dengan dokter terpercaya hanya dalam beberapa klik.
              Rasakan pengalaman penjadwalan kesehatan yang mulus dengan Cliniga - mitra Anda untuk kesehatan yang lebih baik.
            </p>

            <div
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4"
              style={{
                animation: 'fadeInUp 1s ease-out 0.6s both',
              }}
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="gap-2 w-full sm:w-auto text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:scale-105"
                  data-testid="button-get-started"
                >
                  Masuk / Daftar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/doctors">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 w-full sm:w-auto text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:scale-105"
                  data-testid="button-find-doctors"
                >
                  Cari Dokter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION dengan stagger animation */}
      <section
        ref={statsRef}
        className="border-y bg-gradient-to-b from-muted/30 to-background py-12 sm:py-16 md:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center transition-all duration-700 ${
                  statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <stat.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Cara Kerjanya
            </h2>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground">
              Mendapatkan layanan kesehatan tidak pernah semudah ini. Ikuti langkah-langkah sederhana ini untuk memesan janji temu Anda.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            {howItWorks.map((item, index) => {
              const { elementRef: itemRef, isVisible: itemVisible } = useIntersectionObserver();
              return (
                <div
                  key={item.step}
                  ref={itemRef}
                  className={`transition-all duration-700 ${
                    itemVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: `${index * 150}ms`,
                  }}
                >
                  <Card className="relative overflow-visible h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-6 sm:p-8">
                      <div className="absolute -top-4 left-6 sm:left-8">
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600 text-sm font-bold text-primary-foreground shadow-lg">
                          {item.step}
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-300 hover:scale-110 hover:bg-primary/20">
                          <item.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold">{item.title}</h3>
                        <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED DOCTORS SECTION dengan Carousel */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start sm:items-center sm:justify-between gap-4 sm:flex-row mb-12 sm:mb-16">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Temui Dokter Kami
              </h2>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-muted-foreground">
                Profesional kesehatan ahli siap membantu Anda
              </p>
            </div>
            <Link href="/doctors">
              <Button
                variant="outline"
                className="gap-2 w-full sm:w-auto text-xs sm:text-sm transition-all duration-300 hover:shadow-lg"
                data-testid="button-view-all-doctors"
              >
                Lihat Semua Dokter
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Desktop Grid View (3 kolom) */}
          <div className="hidden lg:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredDoctors.map((doctor) => (
              <InteractiveDoctorCard
                key={doctor.id}
                doctor={doctor}
                featured={true}
                data-testid={`card-featured-doctor-${doctor.id}`}
              />
            ))}
          </div>

          {/* Tablet Grid View (2 kolom) */}
          <div className="hidden md:grid lg:hidden gap-6 grid-cols-2">
            {featuredDoctors.slice(0, 2).map((doctor) => (
              <InteractiveDoctorCard
                key={doctor.id}
                doctor={doctor}
                featured={true}
                data-testid={`card-featured-doctor-${doctor.id}`}
              />
            ))}
          </div>

          {/* Mobile Carousel View */}
          <div className="md:hidden">
            {featuredDoctors.length > 0 && (
              <Carousel
                items={featuredDoctors}
                renderItem={(doctor) => (
                  <div className="p-4 h-96 sm:h-auto">
                    <InteractiveDoctorCard
                      doctor={doctor}
                      featured={true}
                      data-testid={`card-featured-doctor-${doctor.id}`}
                    />
                  </div>
                )}
                autoPlayInterval={6000}
              />
            )}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Mengapa Memilih Cliniga?
            </h2>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground">
              Kami menyediakan pengalaman kesehatan terbaik dengan teknologi modern dan profesional terpercaya.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Dokter Terverifikasi",
                description:
                  "Semua dokter kami terverifikasi dan bersertifikat dengan pengalaman bertahun-tahun.",
              },
              {
                title: "Penjadwalan Mudah",
                description:
                  "Pesan janji temu hanya dalam beberapa klik dengan sistem booking intuitif kami.",
              },
              {
                title: "Rekam Medis Aman",
                description:
                  "Catatan medis Anda disimpan dengan aman dan hanya dapat diakses oleh Anda dan dokter Anda.",
              },
              {
                title: "Dukungan 24/7",
                description:
                  "Tim dukungan kami tersedia 24 jam sehari untuk membantu Anda dengan pertanyaan apa pun.",
              },
              {
                title: "Banyak Spesialisasi",
                description:
                  "Temukan spesialis di berbagai bidang medis semuanya dalam satu platform.",
              },
              {
                title: "Pengingat Janji Temu",
                description:
                  "Jangan pernah lewatkan janji temu dengan sistem pengingat otomatis kami.",
              },
            ].map((feature, index) => {
              const { elementRef: featureRef, isVisible: featureVisible } = useIntersectionObserver();
              return (
                <div
                  key={feature.title}
                  ref={featureRef}
                  className={`flex gap-4 p-4 sm:p-6 rounded-lg border border-transparent hover:border-primary/20 transition-all duration-500 ${
                    featureVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                    animation: featureVisible ? 'none' : '',
                  }}
                >
                  <div className="shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">{feature.title}</h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION dengan gradient background */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-blue-600 to-primary py-12 sm:py-16 md:py-20 text-primary-foreground">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Siap Memulai?
            </h2>
            <p className="max-w-2xl text-sm sm:text-base md:text-lg text-primary-foreground/90">
              Bergabunglah dengan ribuan pasien yang mempercayai Cliniga untuk kebutuhan kesehatan mereka. Daftar hari ini dan pesan janji temu pertama Anda.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-sm sm:text-base transition-all duration-300 hover:shadow-xl hover:scale-105"
                data-testid="button-cta-signup"
              >
                Buat Akun Gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}