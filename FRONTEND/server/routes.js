import { storage } from "./storage";
import { randomUUID } from "crypto";
import { z } from "zod";
import { loginSchema, registerSchema, insertAppointmentSchema, insertMedicalRecordSchema } from "../shared/schema.js";

export async function registerRoutes(httpServer, app) {
  
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(data.email);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      if (user.password !== data.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      if (user.role !== data.role) {
        return res.status(401).json({ message: `No ${data.role} account found with this email` });
      }
      
      const token = randomUUID();
      
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const user = await storage.createUser({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      });
      
      // If registering as a doctor, create a doctor profile
      if (data.role === "doctor") {
        await storage.createDoctor({
          userId: user.id,
          name: data.name,
          specialization: "General Medicine",
          schedule: "Mon-Fri, 9:00 AM - 5:00 PM",
          bio: null,
          imageUrl: null,
        });
      }
      
      const token = randomUUID();
      
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Doctors routes
  app.get("/api/doctors", async (req, res) => {
    try {
      const doctors = await storage.getDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/doctors/:id", async (req, res) => {
    try {
      const doctor = await storage.getDoctor(req.params.id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Appointments routes
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/appointments/patient/:patientId", async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByPatient(req.params.patientId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/appointments/doctor/:doctorId", async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByDoctor(req.params.doctorId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/appointments", async (req, res) => {
    try {
      const data = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(data);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.updateAppointment(req.params.id, req.body);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Medical Records routes
  app.get("/api/medical-records", async (req, res) => {
    try {
      const records = await storage.getMedicalRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/medical-records/patient/:patientId", async (req, res) => {
    try {
      const records = await storage.getMedicalRecordsByPatient(req.params.patientId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/medical-records/appointment/:appointmentId", async (req, res) => {
    try {
      const records = await storage.getMedicalRecordsByAppointment(req.params.appointmentId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/medical-records", async (req, res) => {
    try {
      const data = insertMedicalRecordSchema.parse(req.body);
      const record = await storage.createMedicalRecord(data);
      
      // Mark the appointment as completed
      await storage.updateAppointment(data.appointmentId, { status: "completed" });
      
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
