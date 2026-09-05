const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create or open database
const db = new sqlite3.Database(path.resolve(__dirname, 'dental_clinic.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create tables if they don't exist
  db.serialize(() => {
    // Patients table
    db.run(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        is_new_patient BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Appointments table
    db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER,
        service TEXT NOT NULL,
        dentist TEXT NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status TEXT DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients (id)
      )
    `);

    // Contact messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date)
    `);

    db.run(`
      CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email)
    `);
  });
}

// Export database methods
module.exports = {
  db,
  // Patient methods
  createPatient: (patientData) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO patients (name, phone, email, is_new_patient) VALUES (?, ?, ?, ?)`,
        [patientData.name, patientData.phone, patientData.email, patientData.isNewPatient || 0],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, ...patientData });
          }
        }
      );
    });
  },

  // Appointment methods
  createAppointment: (appointmentData) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO appointments (patient_id, service, dentist, appointment_date, appointment_time, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          appointmentData.patientId,
          appointmentData.service,
          appointmentData.dentist,
          appointmentData.date,
          appointmentData.time,
          appointmentData.status || 'scheduled'
        ],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, ...appointmentData });
          }
        }
      );
    });
  },

  // Contact methods
  createContactMessage: (contactData) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO contact_messages (name, phone, email, subject, message)
         VALUES (?, ?, ?, ?, ?)`,
        [contactData.name, contactData.phone, contactData.email, contactData.subject, contactData.message],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, ...contactData });
          }
        }
      );
    });
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
    process.exit(0);
  });
});