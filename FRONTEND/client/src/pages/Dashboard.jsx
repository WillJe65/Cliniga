import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import MedicalRecordModal from "@/components/modals/MedicalRecordModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Calendar, CalendarPlus, Clock, History, Stethoscope, FileText } from "lucide-react";
import { Link } from "wouter";
import { format, parseISO, isToday, isFuture, isPast } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [recordModalOpen, setRecordModalOpen] = useState(false);

  const { data: allAppointments = [], isLoading } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const appointments = allAppointments.filter((apt) => {
    if (user?.role === "patient") {
      return apt.patientId === user.id;
    }
    if (user?.role === "doctor") {
      return apt.doctorName === user.name;
    }
    return false;
  });

  const addRecordMutation = useMutation({
    mutationFn: async ({ appointmentId, diagnosis, notes }) => {
      await apiRequest("POST", "/api/medical-records", {
        appointmentId,
        patientId: selectedAppointment?.patientId,
        doctorId: user?.id,
        diagnosis,
        notes,
        createdAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Record saved",
        description: "Medical record has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save medical record. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddRecord = (appointment) => {
    setSelectedAppointment(appointment);
    setRecordModalOpen(true);
  };

  const handleSaveRecord = async (diagnosis, notes) => {
    if (!selectedAppointment) return;
    await addRecordMutation.mutateAsync({
      appointmentId: selectedAppointment.id,
      diagnosis,
      notes,
    });
  };

  const todayAppointments = appointments.filter((apt) => {
    try {
      return isToday(parseISO(apt.date)) && apt.status !== "cancelled";
    } catch {
      return false;
    }
  });

  const upcomingAppointments = appointments.filter((apt) => {
    try {
      const date = parseISO(apt.date);
      return (isFuture(date) || isToday(date)) && apt.status !== "cancelled";
    } catch {
      return false;
    }
  });

  const pastAppointments = appointments.filter((apt) => {
    try {
      const date = parseISO(apt.date);
      return isPast(date) && !isToday(date);
    } catch {
      return false;
    }
  });

  if (user?.role === "doctor") {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-muted/30 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight" data-testid="text-dashboard-title">
                  Welcome, Dr. {user.name}
                </h1>
                <p className="mt-2 text-muted-foreground">Manage your appointments and patient records</p>
              </div>
              <Link href="/">
                <Button variant="outline">← Kembali ke Landing Page</Button>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-today-count">{todayAppointments.length}</p>
                    <p className="text-sm text-muted-foreground">Today's Appointments</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-upcoming-count">{upcomingAppointments.length}</p>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-completed-count">{pastAppointments.filter((a) => a.status === "completed").length}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>{format(new Date(), "EEEE, MMMM d, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : todayAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No appointments today</h3>
                    <p className="mt-2 text-sm text-muted-foreground">You don't have any scheduled appointments for today</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} viewType="doctor" onAddRecord={() => handleAddRecord(appointment)} />
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
        <MedicalRecordModal open={recordModalOpen} onOpenChange={setRecordModalOpen} appointment={selectedAppointment} onSave={handleSaveRecord} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight" data-testid="text-dashboard-title">Welcome, {user?.name}</h1>
              <p className="mt-2 text-muted-foreground">Manage your healthcare appointments</p>
            </div>
            <Link href="/book-appointment">
              <Button className="gap-2" data-testid="button-new-appointment">
                <CalendarPlus className="h-4 w-4" />
                Book Appointment
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-upcoming-patient">{upcomingAppointments.length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                  <Stethoscope className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-completed-patient">{pastAppointments.filter((a) => a.status === "completed").length}</p>
                  <p className="text-sm text-muted-foreground">Completed Visits</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <History className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-patient">{appointments.length}</p>
                  <p className="text-sm text-muted-foreground">Total Appointments</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>My Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="upcoming" className="gap-2" data-testid="tab-upcoming">
                    <Calendar className="h-4 w-4" />
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger value="history" className="gap-2" data-testid="tab-history">
                    <History className="h-4 w-4" />
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : upcomingAppointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">No upcoming appointments</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Book your first appointment to get started</p>
                      <Link href="/book-appointment">
                        <Button className="mt-4 gap-2">
                          <CalendarPlus className="h-4 w-4" />
                          Book Appointment
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments
                        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
                        .map((appointment) => (
                          <AppointmentCard key={appointment.id} appointment={appointment} viewType="patient" />
                        ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : pastAppointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <History className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">No appointment history</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Your past appointments will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastAppointments
                        .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
                        .map((appointment) => (
                          <AppointmentCard key={appointment.id} appointment={appointment} viewType="patient" />
                        ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
