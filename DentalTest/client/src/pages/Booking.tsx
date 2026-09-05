import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

// Mock data for dentists and services
const dentists = [
  { id: 1, name: 'Dr. Shrestha', specialties: ['implants', 'cosmetic'], rating: 4.8, image: '/images/team/dr-shrestha.jpg' },
  { id: 2, name: 'Dr. Sharma', specialties: ['orthodontics', 'pediatric'], rating: 4.9, image: '/images/team/dr-sharma.jpg' },
  { id: 3, name: 'Dr. Patel', specialties: ['cleaning', 'fillings', 'root-canal'], rating: 4.7, image: '/images/team/dr-patel.jpg' }
]

const services = [
  { id: 'cleaning', title: 'Cleanings & Prevention', duration: 60 },
  { id: 'fillings', title: 'Fillings & Restorations', duration: 45 },
  { id: 'root-canal', title: 'Root Canal Therapy', duration: 90 },
  { id: 'implants', title: 'Dental Implants', duration: 90 },
  { id: 'orthodontics', title: 'Orthodontics & Invisalign', duration: 60 },
  { id: 'whitening', title: 'Teeth Whitening', duration: 60 },
  { id: 'emergency', title: 'Emergency Dental Care', duration: 30 },
  { id: 'pediatric', title: 'Pediatric Dentistry', duration: 45 },
  { id: 'cosmetic', title: 'Cosmetic Dentistry', duration: 60 }
]

const Booking: React.FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDentist, setSelectedDentist] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [patientInfo, setPatientInfo] = useState<{name:string; phone:string; email:string; isNewPatient:boolean}>({
    name: '',
    phone: '',
    email: '',
    isNewPatient: false
  })
  const [isLoading, setIsLoading] = useState(false)

  // Available time slots (simplified)
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ]

  // Form schemas for each step
  const patientInfoSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'),
    email: z.string().email('Please enter a valid email address'),
    isNewPatient: z.boolean()
  })

  const {
    register: patientRegister,
    handleSubmit: patientHandleSubmit,
    formState: { errors: patientErrors },
    reset: patientReset
  } = useForm<z.infer<typeof patientInfoSchema>>({
    resolver: zodResolver(patientInfoSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      isNewPatient: false
    }
  })

  const onPatientSubmit = (data: z.infer<typeof patientInfoSchema>) => {
    setPatientInfo(data)
    setStep(2)
  }

  // Booking Form Step 2-4 handled by state

  const onBookingSubmit = async () => {
    if (!selectedService || !selectedDentist || !selectedDate || !selectedTime) {
      alert('Please complete all steps before booking')
      return
    }

    setIsLoading(true)
    try {
      const appointmentData = {
        service: selectedService,
        dentist: selectedDentist.toString(),
        date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
        time: selectedTime,
        patientInfo
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to book appointment')
      }

      setIsLoading(false)
      alert(`Appointment booked successfully!\n\nService: ${services.find(s => s.id === selectedService)?.title}\nDentist: ${dentists.find(d => d.id === selectedDentist)?.name}\nDate: ${selectedDate.toLocaleDateString()}\nTime: ${selectedTime}\n\nYou will receive a confirmation SMS and email shortly.`)
      navigate('/')
    } catch (error) {
      console.error('Booking error:', error)
      setIsLoading(false)
      alert('Failed to book appointment: ' + error.message)
    }
  }

  const getAvailableDentists = () => {
    if (!selectedService) return dentists
    return dentists.filter(dentist =>
      dentist.specialties.includes(selectedService as string) ||
      dentist.specialties.includes('general')
    )
  }

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex space-x-4">
          <div className={`flex-1 flex items-center justify-center py-3 text-sm font-medium
                      ${step >= 1 ? 'bg-primary-600 text-white' : 'border-2 border-dashed border-gray-300 text-gray-400'}`}>
            1. Patient Info
          </div>
          <div className="w-0.5 bg-gray-200"></div>
          <div className={`flex-1 flex items-center justify-center py-3 text-sm font-medium
                      ${step >= 2 ? 'bg-primary-600 text-white' : 'border-2 border-dashed border-gray-300 text-gray-400'}`}>
            2. Treatment & Dentist
          </div>
          <div className="w-0.5 bg-gray-200"></div>
          <div className={`flex-1 flex items-center justify-center py-3 text-sm font-medium
                      ${step >= 3 ? 'bg-primary-600 text-white' : 'border-2 border-dashed border-gray-300 text-gray-400'}`}>
            3. Date & Time
          </div>
          <div className="w-0.5 bg-gray-200"></div>
          <div className={`flex-1 flex items-center justify-center py-3 text-sm font-medium
                      ${step === 4 ? 'bg-primary-600 text-white' : 'border-2 border-dashed border-gray-300 text-gray-400'}`}>
            4. Confirmation
          </div>
        </div>
      </div>

      {/* Step 1: Patient Information */}
      {step === 1 && (
        <section className="mb-12">
          <div className="container">
            <h1 className="section-title mb-4">Schedule Your Appointment</h1>
            <p className="section-subtitle mb-8">
              Let's get started with some basic information to book your dental visit.
            </p>
            <form onSubmit={patientHandleSubmit(onPatientSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    {...patientRegister('name')}
                    className={`input w-full ${patientErrors.name ? 'border-red-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {patientErrors.name && <p className="text-red-500 text-sm mt-1>{patientErrors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    {...patientRegister('phone')}
                    className={`input w-full ${patientErrors.phone ? 'border-red-500' : ''}`}
                    placeholder="+977-XXXXXXXX"
                  />
                  {patientErrors.phone && <p className="text-red-500 text-sm mt-1>{patientErrors.phone.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  {...patientRegister('email')}
                  className={`input w-full ${patientErrors.email ? 'border-red-500' : ''}`}
                  placeholder="your@email.com"
                />
                {patientErrors.email && <p className="text-red-500 text-sm mt-1>{patientErrors.email.message}</p>}
              </div>
              <div className="flex items-center space-x-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...patientRegister('isNewPatient')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm">I am a new patient</span>
                </label>
              </div>
              <button type="submit" className="btn-primary w-full py-3">
                Continue to Treatment Selection
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Step 2: Select Treatment & Dentist */}
      {step === 2 && (
        <section className="mb-12">
          <div className="container">
            <h1 className="section-title mb-4">Choose Your Treatment</h1>
            <p className="section-subtitle mb-8">
              Select the type of dental service you need.
            </p>

            {/* Service Selection */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6">Select Treatment Type</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`cursor-pointer p-6 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all
                          ${selectedService === service.id ? 'border-primary-600 bg-primary-50' : ''}`}
                  >
                    <div className="flex items-center mb-3">
                      <svg className="w-8 h-8 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {/* Simple icon based on service */}
                        {service.id === 'cleaning' && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138a3.42 3.42 0 00.806 1.946 3.42 3.42 0 01-3.138 1.946 3.42 3.42 0 00-3.138-1.946 3.42 3.42 0 01-.806-3.138 3.42 3.42 0 00-.806 3.138A3.42 3.42 0 014.697 12.13a3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-.806 3.138 3.42 3.42 0 003.138 1.946 3.42 3.42 0 004.095 0 3.42 3.42 0 013.138-1.946 3.42 3.42 0 00-.806-3.138 3.42 3.42 0 00-2.562-.663" />
                        )}
                        {service.id === 'implants' && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                        )}
                        {service.id === 'orthodontics' && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M9 19l3-3m0 0l3 3m0 0l3 3m-3-3v3m3-3V10" />
                        )}
                        {!['cleaning','implants','orthodontics'].includes(service.id) && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                        )}
                      </svg>
                      <h3 className="text-lg font-semibold">{service.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Approx. duration: {service.duration} minutes
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dentist Selection (shown after service selected) */}
            {selectedService && (
              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-6">Choose Your Dentist</h2>
                <p className="text-gray-600 mb-4">
                  Select a dentist who specializes in your chosen treatment.
                </p>
                <div className="grid gap-6">
                  {getAvailableDentists().map(dentist => (
                    <div
                      key={dentist.id}
                      onClick={() => setSelectedDentist(dentist.id)}
                      className={`cursor-pointer card p-6 hover:shadow-md transition-shadow duration-200
                            ${selectedDentist === dentist.id ? 'border-2 border-primary-600' : ''}`}
                    >
                      <div className="flex items-center mb-4">
                        <img
                          src={dentist.image}
                          alt={`Photo of Dr. ${dentist.name}`}
                          className="w-16 h-16 object-cover rounded-full mr-4"
                        />
                        <div>
                          <h3 className="text-lg font-semibold">Dr. {dentist.name}</h3>
                          <p className="text-gray-600">
                            {dentist.specialties.join(', ')}
                          </p>
                          <div className="flex items-center mt-2">
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.208 4.382a1 1 0 001.518.61l4.325-2.483a1 1 0 001.067-1.62l-3.922-3.803a1 1 0 00-1.067-1.62l-4.325 2.483a1 1 0 00-1.518.61l1.208-4.382a1 1 0 00-.363-1.118l-3.976-2.888a1 1 0 00-.588-1.81l1.519-4.674zM5.276 4.795L4.192 6.57a1 1 0 00-.192 1.161l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.208 4.382a1 1 0 001.518.61l4.325-2.483a1 1 0 001.067-1.62l-3.922-3.803a1 1 0 00-1.067-1.62l-4.325 2.483a1 1 0 00-1.518.61l1.208-4.382a1 1 0 00-.363-1.118l-3.976-2.888a1 1 0 00-.588-1.81l1.519-4.674z" />
                            </svg>
                            <span className="text-sm font-medium">{dentist.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Continue button when both service and dentist are selected */}
                {selectedService && selectedDentist && (
                  <div className="mt-6">
                    <button
                      onClick={() => setStep(3)}
                      className="btn-primary w-full py-3"
                    >
                      Continue to Date & Time
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Step 3: Select Date & Time */}
      {step === 3 && (
        <section className="mb-12">
          <div className="container">
            <h1 className="section-title mb-4">Select Date & Time</h1>
            <p className="section-subtitle mb-8">
              Choose your preferred appointment date and time.
            </p>

            {/* Date Selection */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6">Select Date</h2>
              <div className="card p-6">
                <Calendar
                  onChange={(date) => {
                    if (date) {
                      setSelectedDate(date)
                    }
                  }}
                  minDate={new Date()}
                  className="w-full"
                />
                {!selectedDate && (
                  <p className="mt-2 text-red-500 text-center">
                    Please select a date
                  </p>
                )}
              </div>
            </div>

            {/* Time Selection (shown after date selected) */}
            {selectedDate && (
              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-6">Select Time</h2>
                <p className="text-gray-600 mb-4">
                  Available times for {selectedDate.toLocaleDateString()}
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  {timeSlots.map(time => (
                    <div
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`cursor-pointer p-4 text-center border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all
                            ${selectedTime === time ? 'border-primary-600 bg-primary-50' : ''}`}
                    >
                      <span className="font-medium">{time}</span>
                    </div>
                  )}
                </div>
                {!selectedTime && (
                  <p className="mt-2 text-red-500 text-center">
                    Please select a time
                  </p>
                )}
              </div>
            )}
            {/* Continue button when both date and time are selected */}
            {selectedDate && selectedTime && (
              <div className="mt-6">
                <button
                  onClick={() => setStep(4)}
                  className="btn-primary w-full py-3"
                >
                  Continue to Confirmation
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Step 4: Confirmation & Submit */}
      {step === 4 && (
        <section className="mb-12">
          <div className="container">
            <h1 className="section-title mb-4">Confirm Your Appointment</h1>
            <p className="section-subtitle mb-8">
              Please review your appointment details below.
            </p>

            <div className="card p-8">
              <div className="space-y-6">
                <div className="flex items-center">
                  <svg className="w-8 h-8 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138a3.42 3.42 0 00.806 1.946 3.42 3.42 0 01-3.138 1.946 3.42 3.42 0 00-3.138-1.946 3.42 3.42 0 01-.806-3.138 3.42 3.42 0 00-4.438 0 3.42 3.42 0 01-1.946-.806 3.42 3.42 0 00-.806 3.138A3.42 3.42 0 014.697 12.13a3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-.806 3.138 3.42 3.42 0 003.138 1.946 3.42 3.42 0 004.095 0 3.42 3.42 0 013.138-1.946 3.42 3.42 0 00-.806-3.138 3.42 3.42 0 00-2.562-.663" />
                  </svg>
                  <div>
                    <h2 className="text-xl font-bold">Appointment Summary</h2>
                    <p className="text-gray-600">
                      Your appointment has been scheduled and is ready for confirmation.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{services.find(s => s.id === selectedService)?.title || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dentist:</span>
                    <span className="font-medium">Dr. {dentists.find(d => d.id === selectedDentist)?.name || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{selectedDate ? selectedDate.toLocaleDateString() : 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{selectedTime || 'Not selected'}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={onBookingSubmit}
                    disabled={isLoading}
                    className="btn-primary w-full py-3"
                  >
                    {isLoading ? 'Booking Appointment...' : 'Confirm & Book Appointment'}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <Link to="/" className="text-sm text-primary-600 hover:text-primary-700">
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Booking