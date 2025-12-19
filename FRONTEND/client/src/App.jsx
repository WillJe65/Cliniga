import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Doctors from "@/pages/Doctors";
import Dashboard from "@/pages/Dashboard";
import DoctorDashboard from "@/pages/DoctorDashboard";
import DoctorProfileAccount from "@/pages/DoctorProfileAccount";
import DoctorSettings from "@/pages/DoctorSettings";
import DoctorAppointmentList from "@/pages/DoctorAppointmentList";
import DoctorIncomingAppointments from "@/pages/DoctorIncomingAppointments";
import DoctorConfirmAppointment from "@/pages/DoctorConfirmAppointment";
import BookAppointment from "@/pages/BookAppointment";
import PatientDashboard from "@/pages/PatientDashboard";
import PatientBookAppointment from "@/pages/PatientBookAppointment";
import PatientUpcomingAppointment from "@/pages/PatientUpcomingAppointment";
import PatientMedicalRecord from "@/pages/PatientMedicalRecord";
import PatientProfileAccount from "@/pages/PatientProfileAccount";
import PatientSettings from "@/pages/PatientSettings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/doctors" component={Doctors} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/patient-dashboard">
        <ProtectedRoute allowedRoles={["patient"]}>
          <PatientDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/patient-book">
        <ProtectedRoute allowedRoles={["patient"]}>
          <PatientBookAppointment />
        </ProtectedRoute>
      </Route>
      <Route path="/patient-upcoming">
        <ProtectedRoute allowedRoles={["patient"]}>
          <PatientUpcomingAppointment />
        </ProtectedRoute>
      </Route>
      <Route path="/patient-medical-records">
        <ProtectedRoute allowedRoles={["patient"]}>
          <PatientMedicalRecord />
        </ProtectedRoute>
      </Route>
      <Route path="/patient-profile">
        <ProtectedRoute allowedRoles={["patient"]}>
          <PatientProfileAccount />
        </ProtectedRoute>
      </Route>
      <Route path="/patient-settings">
        <ProtectedRoute allowedRoles={["patient"]}>
          <PatientSettings />
        </ProtectedRoute>
      </Route>
      <Route path="/medical-records">
        <ProtectedRoute allowedRoles={["patient"]}>
          <PatientMedicalRecord />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute allowedRoles={["patient"]}>
          <PatientProfileAccount />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor-dashboard">
        <ProtectedRoute allowedRoles={["doctor"]}>
          <DoctorDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor-profile">
        <ProtectedRoute allowedRoles={["doctor"]}>
          <DoctorProfileAccount />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor-settings">
        <ProtectedRoute allowedRoles={["doctor"]}>
          <DoctorSettings />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor-appointments">
        <ProtectedRoute allowedRoles={["doctor"]}>
          <DoctorAppointmentList />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor-incoming-appointments">
        <ProtectedRoute allowedRoles={["doctor"]}>
          <DoctorIncomingAppointments />
        </ProtectedRoute>
      </Route>
      <Route path="/doctor-confirm-appointment/:appointmentId">
        <ProtectedRoute allowedRoles={["doctor"]}>
          <DoctorConfirmAppointment />
        </ProtectedRoute>
      </Route>
      <Route path="/book-appointment">
        <ProtectedRoute allowedRoles={["patient"]}>
          <BookAppointment />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
