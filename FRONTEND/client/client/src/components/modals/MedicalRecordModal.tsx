import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, User, FileText, Loader2 } from "lucide-react";
import type { Appointment } from "@shared/schema";
import { format, parseISO } from "date-fns";

interface MedicalRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onSave: (diagnosis: string, notes: string) => Promise<void>;
}

export function MedicalRecordModal({
  open,
  onOpenChange,
  appointment,
  onSave,
}: MedicalRecordModalProps) {
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!diagnosis.trim()) return;
    setIsLoading(true);
    try {
      await onSave(diagnosis, notes);
      setDiagnosis("");
      setNotes("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save medical record:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setDiagnosis("");
      setNotes("");
    }
    onOpenChange(open);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Add Medical Record
          </DialogTitle>
          <DialogDescription>
            Add diagnosis and notes for this appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(appointment.patientName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{appointment.patientName}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(appointment.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {appointment.time}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis" className="text-base">
                Diagnosis <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="diagnosis"
                placeholder="Enter the diagnosis..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="min-h-[100px] resize-none"
                data-testid="input-diagnosis"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional notes, prescriptions, or recommendations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] resize-none"
                data-testid="input-notes"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isLoading}
            data-testid="button-cancel-record"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!diagnosis.trim() || isLoading}
            data-testid="button-save-record"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
