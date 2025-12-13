import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
});

// Doctors table
export const doctors = pgTable("doctors", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  schedule: text("schedule").notNull(),
  bio: text("bio"),
  imageUrl: text("image_url"),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: varchar("id", { length: 36 }).primaryKey(),
  patientId: varchar("patient_id", { length: 36 }).notNull(),
  patientName: text("patient_name").notNull(),
  doctorId: varchar("doctor_id", { length: 36 }).notNull(),
  doctorName: text("doctor_name").notNull(),
  specialization: text("specialization").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
});

// Medical Records table
export const medicalRecords = pgTable("medical_records", {
  id: varchar("id", { length: 36 }).primaryKey(),
  appointmentId: varchar("appointment_id", { length: 36 }).notNull(),
  patientId: varchar("patient_id", { length: 36 }).notNull(),
  doctorId: varchar("doctor_id", { length: 36 }).notNull(),
  diagnosis: text("diagnosis").notNull(),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertDoctorSchema = createInsertSchema(doctors).omit({ id: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true });
export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({ id: true });

// Login/Register schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["patient", "doctor"]),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["patient", "doctor"]),
});
