import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import type { Doctor } from "@shared/schema";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";

interface DoctorCardProps {
  doctor: Doctor;
  onBook?: () => void;
  selected?: boolean;
  selectable?: boolean;
}

export function DoctorCard({
  doctor,
  onBook,
  selected,
  selectable,
}: DoctorCardProps) {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleBookClick = () => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }
    onBook?.();
  };

  return (
    <Card
      className={`overflow-visible transition-all duration-200 ${
        selectable
          ? "cursor-pointer hover-elevate"
          : ""
      } ${
        selected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : ""
      }`}
      onClick={selectable ? handleBookClick : undefined}
      data-testid={`card-doctor-${doctor.id}`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
          <Avatar className="h-20 w-20 shrink-0">
            {doctor.imageUrl ? (
              <AvatarImage src={doctor.imageUrl} alt={doctor.name} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {getInitials(doctor.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3 min-w-0">
            <div>
              <h3
                className="text-lg font-semibold"
                data-testid={`text-doctor-name-${doctor.id}`}
              >
                Dr. {doctor.name}
              </h3>
              <Badge
                variant="secondary"
                className="mt-1"
                data-testid={`badge-specialization-${doctor.id}`}
              >
                {doctor.specialization}
              </Badge>
            </div>

            {doctor.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {doctor.bio}
              </p>
            )}

            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <Calendar className="h-4 w-4" />
              <span data-testid={`text-schedule-${doctor.id}`}>
                {doctor.schedule}
              </span>
            </div>
          </div>

          {!selectable && user?.role === "patient" && (
            <div className="shrink-0 sm:self-center">
              <Button
                onClick={handleBookClick}
                data-testid={`button-book-doctor-${doctor.id}`}
              >
                Book Now
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
