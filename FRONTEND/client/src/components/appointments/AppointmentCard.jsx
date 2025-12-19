import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, User, Stethoscope, FileText } from "lucide-react";
import { format, parseISO, isToday, isTomorrow, isPast } from "date-fns";

export function AppointmentCard({ appointment, viewType, onViewDetails, onAddRecord }) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr) => {
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) return "Today";
      if (isTomorrow(date)) return "Tomorrow";
      return format(date, "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const displayName = viewType === "patient" ? appointment.doctorName : appointment.patientName;
  const displayRole = viewType === "patient" ? appointment.specialization : "Patient";

  const isAppointmentPast = () => {
    try {
      const appointmentDate = parseISO(appointment.date);
      return isPast(appointmentDate) && !isToday(appointmentDate);
    } catch {
      return false;
    }
  };

  return (
    <Card className="overflow-visible transition-all duration-200 hover-elevate" data-testid={`card-appointment-${appointment.id}`}>
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold truncate" data-testid={`text-name-${appointment.id}`}>
                  {viewType === "patient" ? "Dr. " : ""}
                  {displayName}
                </h3>
                <StatusBadge status={appointment.status} />
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                {viewType === "patient" ? (
                  <Stethoscope className="h-3.5 w-3.5" />
                ) : (
                  <User className="h-3.5 w-3.5" />
                )}
                {displayRole}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5" data-testid={`text-date-${appointment.id}`}>
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(appointment.date)}
                </span>
                <span className="flex items-center gap-1.5" data-testid={`text-time-${appointment.id}`}>
                  <Clock className="h-3.5 w-3.5" />
                  {appointment.time}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 gap-2 sm:flex-col sm:items-end">
            {viewType === "doctor" && appointment.status === "confirmed" && !isAppointmentPast() && (
              <Button size="sm" onClick={onAddRecord} className="gap-1.5" data-testid={`button-add-record-${appointment.id}`}>
                <FileText className="h-3.5 w-3.5" />
                Add Record
              </Button>
            )}
            {onViewDetails && (
              <Button variant="outline" size="sm" onClick={onViewDetails} data-testid={`button-view-details-${appointment.id}`}>
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
