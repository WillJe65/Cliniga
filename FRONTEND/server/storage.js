import { randomUUID } from "crypto";

export class MemStorage {
  constructor() {
    this.users = new Map();
    this.doctors = new Map();
    this.appointments = new Map();
    this.medicalRecords = new Map();

    this.seedData();
  }

  seedData() {
    const doctorUsers = [
      { id: "doc-user-1", email: "dr.smith@cliniga.com", password: "password123", name: "Sarah Smith", role: "dokter" },
      { id: "doc-user-2", email: "dr.johnson@cliniga.com", password: "password123", name: "Michael Johnson", role: "dokter" },
      { id: "doc-user-3", email: "dr.williams@cliniga.com", password: "password123", name: "Emily Williams", role: "dokter" },
      { id: "doc-user-4", email: "dr.brown@cliniga.com", password: "password123", name: "James Brown", role: "dokter" },
      { id: "doc-user-5", email: "dr.davis@cliniga.com", password: "password123", name: "Jennifer Davis", role: "dokter" },
      { id: "doc-user-6", email: "dr.miller@cliniga.com", password: "password123", name: "Robert Miller", role: "dokter" },
      { id: "doc-user-7", email: "dr.anderson@cliniga.com", password: "password123", name: "David Anderson", role: "dokter" },
      { id: "doc-user-8", email: "dr.taylor@cliniga.com", password: "password123", name: "Lisa Taylor", role: "dokter" },
      { id: "doc-user-9", email: "dr.martinez@cliniga.com", password: "password123", name: "Carlos Martinez", role: "dokter" },
      { id: "doc-user-10", email: "dr.wilson@cliniga.com", password: "password123", name: "Patricia Wilson", role: "dokter" },
    ];

    doctorUsers.forEach((user) => {
      this.users.set(user.id, user);
    });

    const doctors = [
      {
        id: "doc-1",
        userId: "doc-user-1",
        name: "Sarah Smith",
        specialization: "Kardiologi",
        schedule: "Senin-Jumat, 09:00 - 17:00",
        bio: "Kardiolog bersertifikat dengan 15 tahun pengalaman dalam menangani kondisi jantung dan penyakit kardiovaskular.",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      },
      {
        id: "doc-2",
        userId: "doc-user-2",
        name: "Michael Johnson",
        specialization: "Dermatologi",
        schedule: "Senin-Kamis, 10:00 - 18:00",
        bio: "Spesialis dalam kondisi kulit, dermatologi kosmetik, dan pencegahan kanker kulit dengan pendekatan berpusat pada pasien.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      },
      {
        id: "doc-3",
        userId: "doc-user-3",
        name: "Emily Williams",
        specialization: "Pediatri",
        schedule: "Senin-Sabtu, 08:00 - 16:00",
        bio: "Dokter anak yang berdedikasi dan passionate tentang kesehatan dan perkembangan anak, dari bayi hingga remaja.",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      },
      {
        id: "doc-4",
        userId: "doc-user-4",
        name: "James Brown",
        specialization: "Ortopedi",
        schedule: "Selasa-Sabtu, 09:00 - 17:00",
        bio: "Ahli bedah ortopedi yang mengkhususkan diri dalam kedokteran olahraga, penggantian sendi, dan prosedur invasif minimal.",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      },
      {
        id: "doc-5",
        userId: "doc-user-5",
        name: "Jennifer Davis",
        specialization: "Neurologi",
        schedule: "Senin-Jumat, 08:00 - 15:00",
        bio: "Ahli saraf dengan keahlian dalam menangani gangguan neurologis termasuk migrain, epilepsi, dan gangguan gerakan.",
        imageUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=400&fit=crop",
      },
      {
        id: "doc-6",
        userId: "doc-user-6",
        name: "Robert Miller",
        specialization: "Kedokteran Umum",
        schedule: "Senin-Jumat, 09:00 - 18:00",
        bio: "Dokter perawatan primer yang berkomitmen pada perawatan kesehatan komprehensif dan kedokteran preventif untuk pasien segala usia.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      },
      {
        id: "doc-7",
        userId: "doc-user-7",
        name: "David Anderson",
        specialization: "Psikiatri",
        schedule: "Senin-Kamis, 10:00 - 17:00",
        bio: "Psikiatris yang berpengalaman dalam menangani gangguan mental, depresi, kecemasan, dan terapi perilaku kognitif.",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      },
      {
        id: "doc-8",
        userId: "doc-user-8",
        name: "Lisa Taylor",
        specialization: "Onkologi",
        schedule: "Senin-Jumat, 08:00 - 16:00",
        bio: "Ahli kanker dengan spesialisasi dalam diagnosis kanker dan terapi kanker, memberikan perawatan yang dipersonalisasi untuk setiap pasien.",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      },
      {
        id: "doc-9",
        userId: "doc-user-9",
        name: "Carlos Martinez",
        specialization: "Oftalmologi",
        schedule: "Selasa-Sabtu, 09:00 - 17:30",
        bio: "Dokter mata yang ahli dalam operasi mata, koreksi refraksi, dan penanganan penyakit mata kronis seperti glaukoma dan katarak.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      },
      {
        id: "doc-10",
        userId: "doc-user-10",
        name: "Patricia Wilson",
        specialization: "Gastroenterologi",
        schedule: "Senin-Kamis, 09:00 - 17:00",
        bio: "Spesialis saluran pencernaan dengan keahlian dalam endoskopi, penanganan penyakit asam lambung, dan gangguan saluran cerna lainnya.",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      },
    ];

    doctors.forEach((doctor) => {
      this.doctors.set(doctor.id, doctor);
    });

    const patientUser = {
      id: "patient-1",
      email: "patient@example.com",
      password: "password123",
      name: "John Doe",
      role: "pasien",
    };
    this.users.set(patientUser.id, patientUser);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const sampleAppointments = [
      {
        id: "apt-1",
        patientId: "patient-1",
        patientName: "John Doe",
        doctorId: "doc-1",
        doctorName: "Sarah Smith",
        specialization: "Kardiologi",
        date: tomorrow.toISOString().split("T")[0],
        time: "10:00",
        status: "dikonfirmasi",
        notes: null,
      },
      {
        id: "apt-2",
        patientId: "patient-1",
        patientName: "John Doe",
        doctorId: "doc-3",
        doctorName: "Emily Williams",
        specialization: "Pediatri",
        date: nextWeek.toISOString().split("T")[0],
        time: "14:30",
        status: "menunggu",
        notes: null,
      },
      {
        id: "apt-3",
        patientId: "patient-1",
        patientName: "John Doe",
        doctorId: "doc-6",
        doctorName: "Robert Miller",
        specialization: "Kedokteran Umum",
        date: lastWeek.toISOString().split("T")[0],
        time: "11:00",
        status: "selesai",
        notes: "Pemeriksaan rutin selesai",
      },
    ];

    sampleAppointments.forEach((apt) => {
      this.appointments.set(apt.id, apt);
    });
  }

  // Users
  async getUser(id) {
    return this.users.get(id);
  }

  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Doctors
  async getDoctors() {
    return Array.from(this.doctors.values());
  }

  async getDoctor(id) {
    return this.doctors.get(id);
  }

  async getDoctorByUserId(userId) {
    return Array.from(this.doctors.values()).find((doc) => doc.userId === userId);
  }

  async createDoctor(insertDoctor) {
    const id = randomUUID();
    const doctor = { ...insertDoctor, id };
    this.doctors.set(id, doctor);
    return doctor;
  }

  // Appointments
  async getAppointments() {
    return Array.from(this.appointments.values());
  }

  async getAppointmentsByPatient(patientId) {
    return Array.from(this.appointments.values()).filter(
      (apt) => apt.patientId === patientId
    );
  }

  async getAppointmentsByDoctor(doctorId) {
    return Array.from(this.appointments.values()).filter(
      (apt) => apt.doctorId === doctorId
    );
  }

  async getAppointment(id) {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment) {
    const id = randomUUID();
    const appointment = { ...insertAppointment, id };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id, updates) {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    const updated = { ...appointment, ...updates };
    this.appointments.set(id, updated);
    return updated;
  }

  // Medical Records
  async getMedicalRecords() {
    return Array.from(this.medicalRecords.values());
  }

  async getMedicalRecordsByPatient(patientId) {
    return Array.from(this.medicalRecords.values()).filter(
      (record) => record.patientId === patientId
    );
  }

  async getMedicalRecordsByAppointment(appointmentId) {
    return Array.from(this.medicalRecords.values()).filter(
      (record) => record.appointmentId === appointmentId
    );
  }

  async createMedicalRecord(insertRecord) {
    const id = randomUUID();
    const record = { ...insertRecord, id };
    this.medicalRecords.set(id, record);
    return record;
  }
}

export const storage = new MemStorage();
