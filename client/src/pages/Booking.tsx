import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Nav from '../components/Nav'
import SectionHeader from '../components/SectionHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import { apiUrl, readJsonResponse } from '../lib/api'

// Mock data for dentists and services
const dentists = [
  { id: 1, name: 'Dr. Rajesh Shrestha', title: 'Implantologist & Cosmetic Surgeon', specialties: ['implants', 'cosmetic', 'root-canal'], rating: 4.9, avatar: '👨‍⚕️' },
  { id: 2, name: 'Dr. Ananya Sharma', title: 'Orthodontist & Pediatric Specialist', specialties: ['orthodontics', 'pediatric', 'whitening'], rating: 4.9, avatar: '👩‍⚕️' },
  { id: 3, name: 'Dr. Rajiv Patel', title: 'General & Endodontic Dentist', specialties: ['cleaning', 'fillings', 'root-canal', 'emergency'], rating: 4.8, avatar: '👨‍⚕️' },
  { id: 4, name: 'Dr. Sunita Gurung', title: 'Pediatric & Preventive Specialist', specialties: ['pediatric', 'cleaning', 'whitening'], rating: 4.9, avatar: '👩‍⚕️' },
  { id: 5, name: 'Dr. Bikash Thapa', title: 'Emergency & Restorative Specialist', specialties: ['emergency', 'root-canal', 'fillings'], rating: 4.8, avatar: '👨‍⚕️' },
  { id: 6, name: 'Dr. Pooja Karki', title: 'Cosmetic & Aesthetic Dentistry Expert', specialties: ['cosmetic', 'whitening', 'implants', 'orthodontics'], rating: 4.9, avatar: '👩‍⚕️' },
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
  { id: 'cosmetic', title: 'Cosmetic Dentistry', duration: 60 },
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
]

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// ─── Inline Calendar Component ────────────────────────────────────────────────
interface InlineCalendarProps {
  selected: Date | null
  onSelect: (date: Date) => void
}

const InlineCalendar: React.FC<InlineCalendarProps> = ({ selected, onSelect }) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div style={{ fontFamily: 'inherit', width: '100%', maxWidth: 340 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button
          type="button"
          onClick={prevMonth}
          style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 16 }}
        >‹</button>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#0b3558' }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 16 }}
        >›</button>
      </div>

      {/* Day labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#94a3b8', padding: '4px 0' }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />

          const cellDate = new Date(viewYear, viewMonth, day)
          cellDate.setHours(0, 0, 0, 0)
          const isPast = cellDate < today
          const isSelected = selected
            ? selected.getFullYear() === viewYear && selected.getMonth() === viewMonth && selected.getDate() === day
            : false
          const isToday = today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day

          return (
            <button
              key={day}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(new Date(viewYear, viewMonth, day))}
              style={{
                border: isToday && !isSelected ? '2px solid #006bff' : '1px solid transparent',
                borderRadius: 8,
                padding: '7px 0',
                cursor: isPast ? 'not-allowed' : 'pointer',
                fontSize: 13,
                fontWeight: isSelected ? 700 : 400,
                background: isSelected ? '#006bff' : 'transparent',
                color: isPast ? '#cbd5e1' : isSelected ? '#fff' : '#0b3558',
                transition: 'all 0.15s',
              }}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Booking Component ───────────────────────────────────────────────────
const patientInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  isNewPatient: z.boolean(),
})

type PatientInfo = z.infer<typeof patientInfoSchema>

const Booking: React.FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDentist, setSelectedDentist] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '', phone: '', email: '', isNewPatient: false,
  })
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch booked slots whenever doctor or date changes
  useEffect(() => {
    if (selectedDentist && selectedDate) {
      const doc = dentists.find((d) => d.id === selectedDentist)
      if (!doc) return
      const dateStr = selectedDate.toISOString().split('T')[0]
      fetch(apiUrl(`/api/appointments/booked?dentist=${encodeURIComponent(doc.name)}&date=${dateStr}`))
        .then(readJsonResponse)
        .then((data) => {
          if (data && data.bookedSlots) {
            setBookedSlots(data.bookedSlots.map((s: any) => s.appointment_time))
          }
        })
        .catch((err) => console.error('Error fetching booked slots:', err))
    }
  }, [selectedDentist, selectedDate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientInfo>({
    resolver: zodResolver(patientInfoSchema),
    defaultValues: { name: '', phone: '', email: '', isNewPatient: false },
  })

  const onPatientSubmit = (data: PatientInfo) => {
    setPatientInfo(data)
    setStep(2)
  }

  const onBookingSubmit = async () => {
    if (!selectedService || !selectedDentist || !selectedDate || !selectedTime) {
      alert('Please complete all steps before booking')
      return
    }
    setIsLoading(true)
    try {
      const doc = dentists.find((d) => d.id === selectedDentist)
      const appointmentData = {
        service: selectedService,
        dentist: doc?.name || selectedDentist.toString(),
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        patientInfo,
      }
      const response = await fetch(apiUrl('/api/appointments'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      })
      const result = await readJsonResponse<{ message?: string }>(response)
      setIsLoading(false)
      alert(
        `Appointment booked successfully!\n\nService: ${services.find((s) => s.id === selectedService)?.title}\nDentist: ${doc?.name}\nDate: ${selectedDate.toLocaleDateString()}\nTime: ${selectedTime}`
      )
      navigate('/')
    } catch (error: any) {
      setIsLoading(false)
      alert('Failed to book appointment: ' + error.message)
    }
  }

  const getAvailableDentists = () => {
    if (!selectedService) return dentists
    return dentists.filter((d) => d.specialties.includes(selectedService))
  }

  // When service changes, reset dentist if no longer available
  const handleServiceChange = (svcId: string) => {
    setSelectedService(svcId)
    const available = dentists.filter((d) => d.specialties.includes(svcId))
    if (selectedDentist && !available.find((d) => d.id === selectedDentist)) {
      setSelectedDentist(null)
    }
  }

  return (
    <div className="bg-cream min-h-screen pb-24">
      <Nav />

      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <SectionHeader
          badgeLabel="ONLINE APPOINTMENT SYSTEM"
          title="Reserve Your Visit in Kathmandu"
          subtitle="Simple 4-step booking process. Choose your service, doctor, and convenient time slot."
        />

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-10 max-w-lg mx-auto">
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                step >= s ? 'bg-primary-indigo text-white' : 'bg-stone/20 text-stone/50'
              }`}>{s}</div>
              {s < 4 && <div className={`flex-1 h-1 rounded-full transition-all ${step > s ? 'bg-primary-indigo' : 'bg-stone/20'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* ── Step 1: Patient Info ── */}
        {step === 1 && (
          <Card variant="white" className="shadow-warm-xl border border-stone/10 p-8 md:p-12">
            <div className="mb-8 text-center">
              <span className="badge-pill mb-2">STEP 1 OF 4</span>
              <h2 className="text-3xl font-reckless text-deep-ink mb-2 font-normal">Patient Information</h2>
              <p className="text-sm font-saans text-deep-ink/70">Enter your details to initiate your appointment request.</p>
            </div>

            <form onSubmit={handleSubmit(onPatientSubmit)} className="space-y-6 max-w-2xl mx-auto">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-saans uppercase tracking-wider text-deep-ink mb-2 font-medium">Full Name</label>
                  <input
                    {...register('name')}
                    className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo font-saans text-sm"
                    placeholder="Enter full name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-saans uppercase tracking-wider text-deep-ink mb-2 font-medium">Phone Number</label>
                  <input
                    {...register('phone')}
                    className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo font-saans text-sm"
                    placeholder="+977-98XXXXXXXX"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-saans uppercase tracking-wider text-deep-ink mb-2 font-medium">Email Address</label>
                <input
                  {...register('email')}
                  className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo font-saans text-sm"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="newPatient"
                  {...register('isNewPatient')}
                  className="h-4 w-4 rounded border-stone/30"
                />
                <label htmlFor="newPatient" className="text-sm font-saans text-deep-ink">
                  I am visiting Kathmandu Dental Care for the first time
                </label>
              </div>

              <Button variant="primary" size="lg" className="w-full">
                Continue to Treatment & Specialist Selection →
              </Button>
            </form>
          </Card>
        )}

        {/* ── Step 2: Service & Dentist ── */}
        {step === 2 && (
          <Card variant="white" className="shadow-warm-xl border border-stone/10 p-8 md:p-12">
            <div className="mb-8 text-center">
              <span className="badge-pill mb-2">STEP 2 OF 4</span>
              <h2 className="text-3xl font-reckless text-deep-ink mb-2 font-normal">Select Treatment & Dentist</h2>
              <p className="text-sm font-saans text-deep-ink/70">Pick the dental procedure and preferred specialist.</p>
            </div>

            {/* Service Grid */}
            <div className="mb-10">
              <h3 className="text-xl font-reckless text-deep-ink mb-4 font-normal">1. Select Service</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceChange(service.id)}
                    className={`cursor-pointer p-5 rounded-xl border transition-all ${
                      selectedService === service.id
                        ? 'border-primary-indigo bg-primary-indigo/10 shadow-sm'
                        : 'border-stone/20 bg-cream/30 hover:border-stone/40'
                    }`}
                  >
                    <h4 className="font-reckless text-lg text-deep-ink mb-1 font-normal">{service.title}</h4>
                    <p className="text-xs font-saans text-stone/70">Duration: ~{service.duration} mins</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dentist Grid — only shows specialists for selected service */}
            {selectedService && (
              <div className="mb-10">
                <h3 className="text-xl font-reckless text-deep-ink mb-4 font-normal">2. Select Specialist</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {getAvailableDentists().map((dentist) => (
                    <div
                      key={dentist.id}
                      onClick={() => setSelectedDentist(dentist.id)}
                      className={`cursor-pointer p-5 rounded-xl border flex items-center gap-4 transition-all ${
                        selectedDentist === dentist.id
                          ? 'border-primary-indigo bg-primary-indigo/10 shadow-sm'
                          : 'border-stone/20 bg-cream/30 hover:border-stone/40'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-pure-white border border-stone/10 flex items-center justify-center text-2xl">
                        {dentist.avatar}
                      </div>
                      <div>
                        <h4 className="font-reckless text-base text-deep-ink font-normal">{dentist.name}</h4>
                        <p className="text-[11px] font-saans text-primary-indigo font-medium">{dentist.title}</p>
                        <p className="text-xs font-saans text-amber-500 font-medium">★ {dentist.rating} / 5.0</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedService && selectedDentist && (
              <Button variant="primary" size="lg" className="w-full mt-6" onClick={() => setStep(3)}>
                Continue to Date & Time Selection →
              </Button>
            )}
          </Card>
        )}

        {/* ── Step 3: Date & Time ── */}
        {step === 3 && (
          <Card variant="white" className="shadow-warm-xl border border-stone/10 p-8 md:p-12">
            <div className="mb-8 text-center">
              <span className="badge-pill mb-2">STEP 3 OF 4</span>
              <h2 className="text-3xl font-reckless text-deep-ink mb-2 font-normal">Choose Date & Time</h2>
              <p className="text-sm font-saans text-deep-ink/70">Select your preferred date and available time slot.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 mb-8">
              {/* Inline Calendar */}
              <div className="flex flex-col items-center bg-cream/40 rounded-2xl border border-stone/15 p-6">
                <InlineCalendar selected={selectedDate} onSelect={(d) => { setSelectedDate(d); setSelectedTime(null) }} />
              </div>

              {/* Time Slots */}
              <div>
                <h3 className="text-xl font-reckless text-deep-ink mb-4 font-normal">Available Time Slots</h3>
                {selectedDate ? (
                  <>
                    <p className="text-xs font-saans text-stone/60 mb-4">
                      Showing slots for <strong>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong>
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((time) => {
                        const isBooked = bookedSlots.includes(time)
                        return (
                          <button
                            key={time}
                            type="button"
                            disabled={isBooked}
                            onClick={() => !isBooked && setSelectedTime(time)}
                            className={`py-2.5 px-3 rounded-full text-xs font-saans font-medium transition-all ${
                              isBooked
                                ? 'bg-stone/10 text-stone/40 line-through cursor-not-allowed border border-stone/10'
                                : selectedTime === time
                                ? 'bg-primary-indigo text-white shadow-sm'
                                : 'bg-cream text-deep-ink hover:bg-stone/10 border border-stone/20'
                            }`}
                          >
                            {time} {isBooked ? '✗' : ''}
                          </button>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-sm font-saans text-stone/60">Please select a date on the calendar first.</p>
                )}
              </div>
            </div>

            {selectedDate && selectedTime && (
              <Button variant="primary" size="lg" className="w-full mt-6" onClick={() => setStep(4)}>
                Review & Confirm Booking →
              </Button>
            )}
          </Card>
        )}

        {/* ── Step 4: Confirm ── */}
        {step === 4 && (
          <Card variant="white" className="shadow-warm-xl border border-stone/10 p-8 md:p-12 max-w-2xl mx-auto text-center">
            <span className="badge-pill mb-4">STEP 4 OF 4</span>
            <h2 className="text-3xl font-reckless text-deep-ink mb-6 font-normal">Confirm Appointment</h2>

            <div className="bg-cream p-6 rounded-2xl border border-stone/10 text-left space-y-4 mb-8">
              {[
                { label: 'Patient Name', value: patientInfo.name },
                { label: 'Phone', value: patientInfo.phone },
                { label: 'Email', value: patientInfo.email },
                { label: 'Treatment', value: services.find((s) => s.id === selectedService)?.title || '' },
                { label: 'Doctor', value: dentists.find((d) => d.id === selectedDentist)?.name || '' },
                {
                  label: 'Date & Time',
                  value: `${selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${selectedTime}`,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-stone/10 pb-2 last:border-0 last:pb-0">
                  <span className="text-xs font-saans text-stone/70 uppercase">{label}:</span>
                  <span className="text-sm font-saans font-medium text-deep-ink text-right max-w-[55%]">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl border border-stone/20 text-sm font-saans text-deep-ink hover:bg-stone/10 transition-all"
              >
                ← Go Back
              </button>
              <Button variant="primary" size="lg" className="flex-2 w-full" onClick={onBookingSubmit}>
                {isLoading ? 'Booking…' : 'Confirm & Finalize Appointment'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Booking