import psycopg2

#ini bisa dikostumisasi sesuai configurasi database yang antum jalanin
#ini buat connect ke database postgresql di root/database/a.sql
conn = psycopg2.connect(
    host="database-pemweb",
    port=5432,
    database="webdb",
    user="user",
    password="user123"
)

cursor = conn.cursor()

# =========================
# FUNCTIONS
# =========================

#ini untuk akses seluruh data di tabel users, tanpa filter apapun
#isinya id, name, email, password, role, created_at
def fetch_users():
    cursor.execute("SELECT * FROM users")
    return cursor.fetchall()

#ini untuk akses seluruh data di tabel doctors, tanpa filter apapun
#isinya id, user_id, specialization, schedule, created_at
def fetch_doctors():
    cursor.execute("SELECT * FROM doctors")
    return cursor.fetchall()

#ini untuk akses seluruh data di tabel medical_records, tanpa filter apapun
#isinya id, appointment_id, diagnosis, notes, created_at
def fetch_medical_records():
    cursor.execute("SELECT * FROM medical_records")
    return cursor.fetchall()

#ini untuk akses seluruh data di tabel appointments, tanpa filter apapun
#isinya id, patient_id, doctor_id, appointment_date, appointment_time,status, created_at
def fetch_appointments():
    cursor.execute("SELECT * FROM appointments")
    return cursor.fetchall()

# =========================
# USAGE
# =========================

users = fetch_users()
for row in users:
    print(row)

doctors = fetch_doctors()
for row in doctors:
    print(row)

medical_records = fetch_medical_records()
for row in medical_records:
    print(row)

appointments = fetch_appointments()
for row in appointments:
    print(row)

# =========================
# CLEANUP
# =========================
cursor.close()
conn.close()
