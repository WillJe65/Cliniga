import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import type { Doctor } from "@shared/schema";

const stats = [
  { icon: Users, value: "500+", label: "Qualified Doctors" },
  { icon: CalendarCheck, value: "10,000+", label: "Appointments Booked" },
  { icon: Building2, value: "50+", label: "Specializations" },
  { icon: Clock, value: "24/7", label: "Support Available" },
];

const howItWorks = [
  {
    step: 1,
    title: "Find Your Doctor",
    description:
      "Browse through our list of qualified doctors and find the right specialist for your needs.",
    icon: Stethoscope,
  },
  {
    step: 2,
    title: "Book Appointment",
    description:
      "Select a convenient date and time that works best for your schedule.",
    icon: Calendar,
  },
  {
    step: 3,
    title: "Get Treatment",
    description:
      "Visit the clinic and receive quality healthcare with your medical records securely stored.",
    icon: Shield,
  },
];

export default function Landing() {
  const { data: doctors = [] } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors"],
  });

  const featuredDoctors = doctors.slice(0, 3);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Trusted Healthcare Platform
            </Badge>
            <h1
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              data-testid="text-hero-title"
            >
              Your Health,{" "}
              <span className="text-primary">Our Priority</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Book appointments with trusted doctors in just a few clicks.
              Experience seamless healthcare scheduling with Cliniga - your
              partner in better health.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2" data-testid="button-get-started">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/doctors">
                <Button size="lg" variant="outline" data-testid="button-find-doctors">
                  Find Doctors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Getting healthcare has never been easier. Follow these simple
              steps to book your appointment.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {howItWorks.map((item) => (
              <Card key={item.step} className="relative overflow-visible">
                <CardContent className="p-8">
                  <div className="absolute -top-4 left-8">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {item.step}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Meet Our Doctors
              </h2>
              <p className="mt-2 text-muted-foreground">
                Expert healthcare professionals ready to help you
              </p>
            </div>
            <Link href="/doctors">
              <Button variant="outline" className="gap-2" data-testid="button-view-all-doctors">
                View All Doctors
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="overflow-visible transition-all duration-200 hover-elevate"
                data-testid={`card-featured-doctor-${doctor.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                        {getInitials(doctor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="mt-4 text-lg font-semibold">
                      Dr. {doctor.name}
                    </h3>
                    <Badge variant="secondary" className="mt-2">
                      {doctor.specialization}
                    </Badge>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {doctor.schedule}
                    </p>
                    <Link href="/book-appointment">
                      <Button className="mt-4 w-full">Book Appointment</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose Cliniga?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We provide the best healthcare experience with modern technology
              and trusted professionals.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Verified Doctors",
                description:
                  "All our doctors are verified and licensed professionals with years of experience.",
              },
              {
                title: "Easy Scheduling",
                description:
                  "Book appointments in just a few clicks with our intuitive booking system.",
              },
              {
                title: "Secure Records",
                description:
                  "Your medical records are stored securely and accessible only to you and your doctors.",
              },
              {
                title: "24/7 Support",
                description:
                  "Our support team is available around the clock to help you with any queries.",
              },
              {
                title: "Multiple Specializations",
                description:
                  "Find specialists across various medical fields all in one platform.",
              },
              {
                title: "Appointment Reminders",
                description:
                  "Never miss an appointment with our automated reminder system.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 rounded-lg p-4"
              >
                <div className="shrink-0">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="max-w-2xl text-lg text-primary-foreground/90">
              Join thousands of patients who trust Cliniga for their healthcare
              needs. Sign up today and book your first appointment.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2"
                data-testid="button-cta-signup"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
