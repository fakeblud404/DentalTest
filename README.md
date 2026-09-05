# Kathmandu Dental Care Website

A complete dental clinic website built with React, Node.js, and SQLite. This MVP includes online appointment booking, patient forms, service information, and contact functionality.

## Features

- **Home Page**: Hero section with clear value proposition and prominent CTAs
- **Services Pages**: Detailed information about dental treatments with before/after galleries
- **Booking System**: Step-by-step appointment booking with real-time availability
- **Patient Forms**: Online registration and medical history forms
- **About Us**: Dentist bios and clinic information
- **Blog**: Dental education articles and oral health tips
- **Contact**: Contact form, clinic information, and Google Maps integration
- **Responsive Design**: Mobile-first approach for all devices
- **Accessibility**: WCAG 2.1 AA considerations implemented
- **Backend API**: Node.js/Express with SQLite database for data persistence

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for fast development builds
- Tailwind CSS for styling
- React Router for client-side routing
- React Hook Form for form validation
- Zod for schema validation
- React Calendar for date selection

### Backend
- Node.js + Express
- SQLite database
- CORS, Helmet, and Morgan middleware
- RESTful API endpoints

### Development Tools
- ESLint & Prettier (can be added)
- Concurrently for running frontend and backend together
- Nodemon for automatic server restarts

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd dental-clinic-website
```

2. Install dependencies for both frontend and backend
```bash
npm run install-all
```

3. Create a `.env` file in the root directory (copy from `.env.example` if provided)
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running the Application

#### Development Mode
```bash
npm run dev
```
This will start:
- Frontend Vite dev server on http://localhost:3000
- Backend Express server on http://localhost:5000

#### Production Build
```bash
# Build frontend
npm run build --prefix client

# Start production server
NODE_ENV=production npm start
```

### Environment Variables

Create a `.env` file with the following variables:

```
NODE_ENV=development
PORT=5000
# For production SMS/email (optional in MVP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=info@kathmandudental.com.np
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
```

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/services` - Get list of services
- `GET /api/dentists` - Get list of dentists
- `POST /api/appointments` - Book a new appointment
- `POST /api/contact` - Submit contact form

## Database Schema

The application uses SQLite with the following tables:

### Patients
- id (INTEGER PK)
- name (TEXT)
- phone (TEXT)
- email (TEXT)
- is_new_patient (BOOLEAN)
- created_at (TIMESTAMP)

### Appointments
- id (INTEGER PK)
- patient_id (INTEGER FK)
- service (TEXT)
- dentist (TEXT)
- appointment_date (DATE)
- appointment_time (TIME)
- status (TEXT)
- created_at (TIMESTAMP)

### Contact Messages
- id (INTEGER PK)
- name (TEXT)
- phone (TEXT)
- email (TEXT)
- subject (TEXT)
- message (TEXT)
- created_at (TIMESTAMP)

## Project Structure

```
dental-clinic-website/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── index.html          # HTML template
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── postcss.config.js   # PostCSS configuration
│   ├── vite.config.ts      # Vite configuration
│   └── tsconfig.json       # TypeScript configuration
├── server.js               # Backend Express server
├── db.js                   # Database initialization and methods
├── .env                    # Environment variables
├── package.json            # Backend dependencies and scripts
└README.md                 # This file
```

## Future Enhancements

1. **Production Database**: Migrate from SQLite to PostgreSQL or MySQL for better scalability
2. **Authentication**: Add patient portal with secure login
3. **Real-time Calendar**: Integrate with actual practice management system
4. **Payment Processing**: Add online payment capabilities for deposits
5. **SMS/WhatsApp Notifications**: Integrate with Twilio for appointment reminders
6. **Email Marketing**: Connect with Mailchimp or similar for newsletters
7. **Analytics**: Add Google Analytics and conversion tracking
8. **Multilingual Support**: Add Nepali language option
9. **Virtual Consultations**: Add video consultation capability
10. **Reviews System**: Integrate with Google Reviews API

## Security Considerations

This MVP includes basic security measures:
- Helmet.js for HTTP header security
- CORS configuration
- Input validation and sanitization
- Parameterized database queries to prevent SQL injection
- Environment variables for sensitive data

For production deployment, additional measures should be implemented:
- HTTPS/SSL certificates
- Regular security audits
- Data encryption at rest
- HIPAA-compliant data handling (if handling protected health information)
- Regular backups
- DDoS protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Tailwind CSS for the utility-first CSS framework
- React team for the excellent frontend library
- Node.js and Express community for backend tools
- Open source community for all the libraries used

---

*Note: This is a Minimum Viable Product (MVP) intended to demonstrate core functionality. For production use, additional security measures, performance optimizations, and feature enhancements would be required.*