const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const { db, createPatient, createAppointment, createContactMessage } = require('./db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001 to avoid conflict

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mock API endpoints for demo
app.get('/api/services', (req, res) => {
  res.json([
    { id: 'cleaning', title: 'Cleanings & Prevention', icon: 'tooth' },
    { id: 'fillings', title: 'Fillings & Restorations', icon: 'circle-help' },
    { id: 'root-canal', title: 'Root Canal Therapy', icon: 'zap' },
    { id: 'implants', title: 'Dental Implants', icon: 'sparkles' },
    { id: 'orthodontics', title: 'Orthodontics & Invisalign', icon: 'sparkles' },
    { id: 'whitening', title: 'Teeth Whitening', icon: 'sun' },
    { id: 'emergency', title: 'Emergency Dental Care', icon: 'alert-triangle' },
    { id: 'pediatric', title: 'Pediatric Dentistry', icon: 'child' },
    { id: 'cosmetic', title: 'Cosmetic Dentistry', icon: 'palette' }
  ]);
});

app.get('/api/dentists', (req, res) => {
  res.json([
    { id: 1, name: 'Dr. Rajesh Shrestha', specialties: ['implants', 'cosmetic', 'root-canal'], rating: 4.9, image: '/images/team/dr-shrestha.jpg' },
    { id: 2, name: 'Dr. Ananya Sharma', specialties: ['orthodontics', 'pediatric', 'whitening'], rating: 4.9, image: '/images/team/dr-sharma.jpg' },
    { id: 3, name: 'Dr. Rajiv Patel', specialties: ['cleaning', 'fillings', 'root-canal', 'emergency'], rating: 4.8, image: '/images/team/dr-patel.jpg' },
    { id: 4, name: 'Dr. Sunita Gurung', specialties: ['pediatric', 'cleaning', 'whitening'], rating: 4.9, image: '/images/team/dr-gurung.jpg' },
    { id: 5, name: 'Dr. Bikash Thapa', specialties: ['emergency', 'root-canal', 'fillings'], rating: 4.8, image: '/images/team/dr-thapa.jpg' },
    { id: 6, name: 'Dr. Pooja Karki', specialties: ['cosmetic', 'whitening', 'implants', 'orthodontics'], rating: 4.9, image: '/images/team/dr-karki.jpg' }
  ]);
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ msg: 'ok' });
});

// Get booked slots for a specific dentist and date (or all booked slots)
app.get('/api/appointments/booked', (req, res) => {
  const { dentist, date } = req.query;
  let sql = `SELECT dentist, appointment_date, appointment_time FROM appointments WHERE status != 'cancelled'`;
  let params = [];

  if (dentist && date) {
    sql += ` AND (dentist = ? OR dentist = ?) AND appointment_date = ?`;
    params = [dentist, dentist.replace('Dr. ', '').trim(), date];
  } else if (date) {
    sql += ` AND appointment_date = ?`;
    params = [date];
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching booked slots:', err);
      return res.status(500).json({ error: 'Failed to fetch booked slots' });
    }
    res.json({ bookedSlots: rows });
  });
});

app.post('/api/appointments', (req, res) => {
  const { service, dentist, date, time, patientInfo } = req.body || {};

  if (!service || !dentist || !date || !time || !patientInfo ||
      !patientInfo.name || !patientInfo.phone || !patientInfo.email) {
    return res.status(400).json({ error: 'Service, dentist, date, time, and complete patient information are required.' });
  }

  const checkSql = `
    SELECT id FROM appointments
    WHERE (dentist = ? OR dentist = ?)
      AND appointment_date = ?
      AND appointment_time = ?
      AND status != 'cancelled'
  `;
  const dentistClean = String(dentist).replace('Dr. ', '').trim();

  db.get(checkSql, [dentist, dentistClean, date, time], (err, existing) => {
    if (err) {
      console.error('Database error checking availability:', err);
      return res.status(500).json({ error: 'Database check failed' });
    }

    if (existing) {
      return res.status(400).json({
        error: 'This time slot is already booked for the selected doctor. Please select an available slot.'
      });
    }

    Promise.resolve().then(async () => {
      const patient = await createPatient({
        name: patientInfo.name,
        phone: patientInfo.phone,
        email: patientInfo.email,
        isNewPatient: patientInfo.isNewPatient || false
      });

      const appointment = await createAppointment({
        patientId: patient.id,
        service,
        dentist,
        date,
        time,
        status: 'scheduled'
      });

      res.json({
        success: true,
        message: 'Appointment booked successfully',
        appointmentId: `APT-${appointment.id}`,
        details: { service, dentist, date, time, patientInfo }
      });
    }).catch((error) => {
      console.error('Booking error:', error);
      if (!res.headersSent) res.status(500).json({ error: 'Failed to save appointment. Please try again.' });
    });
  });
});

app.get('/api/appointments', async (req, res) => {
  try {
    db.all(`
      SELECT a.id, a.service, a.dentist, a.appointment_date, a.appointment_time, a.status, a.created_at,
             p.name as patient_name, p.phone, p.email, p.is_new_patient
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      ORDER BY a.id ASC
    `, [], (err, rows) => {
      if (err) {
        console.error('Error fetching appointments:', err);
        return res.status(500).json({ error: 'Failed to fetch appointments' });
      }
      res.json({ appointments: rows });
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    // Save contact message
    const contact = await createContactMessage({
      name,
      phone,
      email,
      subject,
      message
    });

    // In real app, we would send email notification here
    // For demo, we'll just return success

    res.json({
      success: true,
      message: 'Thank you for your message. We will respond within 24 hours.'
    });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Serve React app for all other routes (client-side routing)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
