import { Link } from "wouter";
import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Cliniga</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Mitra terpercaya Anda dalam layanan kesehatan. Pesan janji temu dengan dokter berkualifikasi dan kelola catatan kesehatan Anda dengan aman.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/doctors"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cari Dokter
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Masuk
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Buat Akun
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Layanan</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Janji Temu Online</li>
              <li>Catatan Medis</li>
              <li>Konsultasi Kesehatan</li>
              <li>Rujukan Spesialis</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Hubungi Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                support@cliniga.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                +67 (812) 345-6789
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Jl. Ngawi Raya No. 67,<br />Kerajaan Ngawi, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              2025 Cliniga. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span className="cursor-pointer transition-colors hover:text-foreground">
                Kebijakan Privasi
              </span>
              <span className="cursor-pointer transition-colors hover:text-foreground">
                Syarat Layanan
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
