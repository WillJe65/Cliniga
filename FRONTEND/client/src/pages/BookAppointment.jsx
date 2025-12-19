import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useSearch, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Check, Clock, Loader2, Stethoscope, User } from "lucide-react";
import { format, isBefore, startOfToday } from "date-fns";
import { convertTo24Hour } from "@/lib/utils";

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

export default function BookAppointment() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState("doctor");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState(null);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["/api/doctors"],
  });

  useEffect(() => {
    const doctorId = new URLSearchParams(search).get("doctor");
    if (doctorId && doctors.length > 0) {
      const doctor = doctors.find((d) => d.id === parseInt(doctorId)); 
      if (doctor) {
        setSelectedDoctor(doctor);
        setCurrentStep("datetime");
      }
    }
  }, [search, doctors]);

  const bookMutation = useMutation({
    mutationFn: async () => {
      // 1. Validasi Input
      if (!selectedDoctor || !selectedDate || !selectedTime || !user) {
        throw new Error("Missing required booking information");
      }

      // 2. Konversi Jam UI (AM/PM) ke Format Backend (24H)
      const formattedTime = convertTo24Hour(selectedTime);

      // 3. Kirim ke Endpoint Backend Python
      const response = await fetch("/api/appointments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: user.id,             
          doctor_id: selectedDoctor.id,    
          appointment_date: format(selectedDate, "yyyy-MM-dd"),
          appointment_time: formattedTime  
        }),
      });

      const data = await response.json();

      // 4. Cek Error dari Backend
      if (!response.ok) {
        throw new Error(data.error || "Gagal booking");
      }
      
      return data;
    },
    // 5. Jika Sukses:
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] }); 
      toast({
        title: "Appointment booked!",
        description: "Your appointment has been scheduled successfully.",
      });
      setLocation("/dashboard"); 
    },
    // 6. Jika Gagal:
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error.message || "Unable to book appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep("datetime");
  };

  const handleSelectDateTime = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep("confirm");
    }
  };

  const handleBack = () => {
    if (currentStep === "datetime") {
      setCurrentStep("doctor");
      setSelectedDoctor(null);
    } else if (currentStep === "confirm") {
      setCurrentStep("datetime");
    }
  };

  const steps = [
    { id: "doctor", label: "Select Doctor", icon: Stethoscope },
    { id: "datetime", label: "Choose Date & Time", icon: CalendarIcon },
    { id: "confirm", label: "Confirm", icon: Check },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight" data-testid="text-book-title">
              Book an Appointment
            </h1>
            <p className="mt-2 text-muted-foreground">
              Schedule your visit in just a few steps
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                        index <= currentStepIndex
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        index <= currentStepIndex
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-4 h-0.5 flex-1 transition-colors ${
                        index < currentStepIndex ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {currentStep === "doctor" && (
            <Card>
              <CardHeader>
                <CardTitle>Select a Doctor</CardTitle>
                <CardDescription>
                  Choose from our network of qualified healthcare professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        selectable
                        selected={selectedDoctor?.id === doctor.id}
                        onBook={() => handleSelectDoctor(doctor)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === "datetime" && selectedDoctor && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Choose Date & Time</CardTitle>
                    <CardDescription>
                      Select your preferred appointment slot with Dr.{" "}
                      {selectedDoctor.name}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Change Doctor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-8 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-4 font-medium flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      Select Date
                    </h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => isBefore(date, startOfToday())}
                      className="rounded-md border"
                      data-testid="calendar-date-picker"
                    />
                  </div>

                  <div>
                    <h3 className="mb-4 font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Select Time
                    </h3>
                    {selectedDate ? (
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            data-testid={`button-time-${time
                              .replace(/\s+/g, "-")
                              .toLowerCase()}`}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed">
                        <p className="text-sm text-muted-foreground">
                          Please select a date first
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleSelectDateTime}
                    disabled={!selectedDate || !selectedTime}
                    className="gap-2"
                    data-testid="button-continue-confirm"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "confirm" &&
            selectedDoctor &&
            selectedDate &&
            selectedTime && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Confirm Your Appointment</CardTitle>
                      <CardDescription>
                        Review your appointment details before confirming
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Change Time
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="rounded-lg bg-muted/50 p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {getInitials(selectedDoctor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <h3 className="text-lg font-semibold">
                            Dr. {selectedDoctor.name}
                          </h3>
                          <Badge variant="secondary">
                            {selectedDoctor.specialization}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3 rounded-lg bg-background p-4">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Date
                            </p>
                            <p
                              className="font-medium"
                              data-testid="text-confirm-date"
                            >
                              {format(selectedDate, "EEEE, MMMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg bg-background p-4">
                          <Clock className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Time
                            </p>
                            <p
                              className="font-medium"
                              data-testid="text-confirm-time"
                            >
                              {selectedTime}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3 rounded-lg bg-background p-4">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Patient
                          </p>
                          <p
                            className="font-medium"
                            data-testid="text-confirm-patient"
                          >
                            {user?.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={handleBack}>
                        Go Back
                      </Button>
                      <Button
                        onClick={() => bookMutation.mutate()}
                        disabled={bookMutation.isPending}
                        className="gap-2"
                        data-testid="button-confirm-booking"
                      >
                        {bookMutation.isPending && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        Confirm Appointment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
}