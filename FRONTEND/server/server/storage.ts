import { randomUUID } from "crypto";
import type {
  User,
  InsertUser,
  Doctor,
  InsertDoctor,
  Appointment,
  InsertAppointment,
  MedicalRecord,
  InsertMedicalRecord,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Doctors
  getDoctors(): Promise<Doctor[]>;
  getDoctor(id: string): Promise<Doctor | undefined>;
  getDoctorByUserId(userId: string): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;

  // Appointments
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByPatient(patientId: string): Promise<Appointment[]>;
  getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | undefined>;

  // Medical Records
  getMedicalRecords(): Promise<MedicalRecord[]>;
  getMedicalRecordsByPatient(patientId: string): Promise<MedicalRecord[]>;
  getMedicalRecordsByAppointment(appointmentId: string): Promise<MedicalRecord[]>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private doctors: Map<string, Doctor>;
  private appointments: Map<string, Appointment>;
  private medicalRecords: Map<string, MedicalRecord>;

  constructor() {
    this.users = new Map();
    this.doctors = new Map();
    this.appointments = new Map();
    this.medicalRecords = new Map();

    this.seedData();
  }

  private seedData() {
    const doctorUsers = [
      { id: "doc-user-1", email: "dr.smith@cliniga.com", password: "password123", name: "Sarah Smith", role: "doctor" as const },
      { id: "doc-user-2", email: "dr.johnson@cliniga.com", password: "password123", name: "Michael Johnson", role: "doctor" as const },
      { id: "doc-user-3", email: "dr.williams@cliniga.com", password: "password123", name: "Emily Williams", role: "doctor" as const },
      { id: "doc-user-4", email: "dr.brown@cliniga.com", password: "password123", name: "James Brown", role: "doctor" as const },
      { id: "doc-user-5", email: "dr.davis@cliniga.com", password: "password123", name: "Jennifer Davis", role: "doctor" as const },
      { id: "doc-user-6", email: "dr.miller@cliniga.com", password: "password123", name: "Robert Miller", role: "doctor" as const },
    ];

    doctorUsers.forEach((user) => {
      this.users.set(user.id, user);
    });

    const doctors: Doctor[] = [
      {
        id: "doc-1",
        userId: "doc-user-1",
        name: "Sarah Smith",
        specialization: "Cardiology",
        schedule: "Mon-Fri, 9:00 AM - 5:00 PM",
        bio: "Board-certified cardiologist with 15 years of experience in treating heart conditions and cardiovascular diseases.",
        imageUrl: null,
      },
      {
        id: "doc-2",
        userId: "doc-user-2",
        name: "Michael Johnson",
        specialization: "Dermatology",
        schedule: "Mon-Thu, 10:00 AM - 6:00 PM",
        bio: "Specializing in skin conditions, cosmetic dermatology, and skin cancer prevention with a patient-centered approach.",
        imageUrl: null,
      },
      {
        id: "doc-3",
        userId: "doc-user-3",
        name: "Emily Williams",
        specialization: "Pediatrics",
        schedule: "Mon-Sat, 8:00 AM - 4:00 PM",
        bio: "Dedicated pediatrician passionate about children's health and development, from newborns to adolescents.",
        imageUrl: null,
      },
      {
        id: "doc-4",
        userId: "doc-user-4",
        name: "James Brown",
        specialization: "Orthopedics",
        schedule: "Tue-Sat, 9:00 AM - 5:00 PM",
        bio: "Expert orthopedic surgeon specializing in sports medicine, joint replacement, and minimally invasive procedures.",
        imageUrl: null,
      },
      {
        id: "doc-5",
        userId: "doc-user-5",
        name: "Jennifer Davis",
        specialization: "Neurology",
        schedule: "Mon-Fri, 8:00 AM - 3:00 PM",
        bio: "Neurologist with expertise in treating neurological disorders including migraines, epilepsy, and movement disorders.",
        imageUrl: null,
      },
      {
        id: "doc-6",
        userId: "doc-user-6",
        name: "Robert Miller",
        specialization: "General Medicine",
        schedule: "Mon-Fri, 9:00 AM - 6:00 PM",
        bio: "Primary care physician committed to comprehensive healthcare and preventive medicine for patients of all ages.",
        imageUrl: null,
      },
    ];

    doctors.forEach((doctor) => {
      this.doctors.set(doctor.id, doctor);
    });

    const patientUser: User = {
      id: "patient-1",
      email: "patient@example.com",
      password: "password123",
      name: "John Doe",
      role: "patient",
    };
    this.users.set(patientUser.id, patientUser);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const sampleAppointments: Appointment[] = [
      {
        id: "apt-1",
        patientId: "patient-1",
        patientName: "John Doe",
        doctorId: "doc-1",
        doctorName: "Sarah Smith",
        specialization: "Cardiology",
        date: tomorrow.toISOString().split("T")[0],
        time: "10:00 AM",
        status: "confirmed",
        notes: null,
      },
      {
        id: "apt-2",
        patientId: "patient-1",
        patientName: "John Doe",
        doctorId: "doc-3",
        doctorName: "Emily Williams",
        specialization: "Pediatrics",
        date: nextWeek.toISOString().split("T")[0],
        time: "02:30 PM",
        status: "pending",
        notes: null,
      },
      {
        id: "apt-3",
        patientId: "patient-1",
        patientName: "John Doe",
        doctorId: "doc-6",
        doctorName: "Robert Miller",
        specialization: "General Medicine",
        date: lastWeek.toISOString().split("T")[0],
        time: "11:00 AM",
        status: "completed",
        notes: "Regular checkup completed",
      },
    ];

    sampleAppointments.forEach((apt) => {
      this.appointments.set(apt.id, apt);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Doctors
  async getDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async getDoctor(id: string): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async getDoctorByUserId(userId: string): Promise<Doctor | undefined> {
    return Array.from(this.doctors.values()).find((doc) => doc.userId === userId);
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = randomUUID();
    const doctor: Doctor = { ...insertDoctor, id };
    this.doctors.set(id, doctor);
    return doctor;
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (apt) => apt.patientId === patientId
    );
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (apt) => apt.doctorId === doctorId
    );
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = { ...insertAppointment, id };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    const updated = { ...appointment, ...updates };
    this.appointments.set(id, updated);
    return updated;
  }

  // Medical Records
  async getMedicalRecords(): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values());
  }

  async getMedicalRecordsByPatient(patientId: string): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values()).filter(
      (record) => record.patientId === patientId
    );
  }

  async getMedicalRecordsByAppointment(appointmentId: string): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values()).filter(
      (record) => record.appointmentId === appointmentId
    );
  }

  async createMedicalRecord(insertRecord: InsertMedicalRecord): Promise<MedicalRecord> {
    const id = randomUUID();
    const record: MedicalRecord = { ...insertRecord, id };
    this.medicalRecords.set(id, record);
    return record;
  }
}

export const storage = new MemStorage();
