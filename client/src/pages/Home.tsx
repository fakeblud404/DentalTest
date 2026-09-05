import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import SectionHeader from '../components/SectionHeader'
import Card from '../components/Card'
import Button from '../components/Button'

// Interactive Home Widget Data & Component
const homeServices = [
  { id: 'cleaning', title: 'Cleanings & Prevention', duration: 45 },
  { id: 'fillings', title: 'Fillings & Restorations', duration: 45 },
  { id: 'root-canal', title: 'Root Canal Therapy', duration: 90 },
  { id: 'implants', title: 'Dental Implants', duration: 90 },
  { id: 'orthodontics', title: 'Orthodontics & Invisalign', duration: 60 },
  { id: 'whitening', title: 'Teeth Whitening', duration: 60 },
  { id: 'emergency', title: 'Emergency Care', duration: 30 },
  { id: 'pediatric', title: 'Pediatric Dentistry', duration: 45 },
  { id: 'cosmetic', title: 'Cosmetic Transformation', duration: 60 },
]

const homeDoctors = [
  { id: 1, name: 'Dr. Rajesh Shrestha', title: 'Implantologist & Cosmetic Surgeon', specialties: ['implants', 'cosmetic', 'root-canal'] },
  { id: 2, name: 'Dr. Ananya Sharma', title: 'Orthodontist & Invisalign Specialist', specialties: ['orthodontics', 'pediatric', 'whitening'] },
  { id: 3, name: 'Dr. Rajiv Patel', title: 'General & Endodontic Dentist', specialties: ['cleaning', 'fillings', 'root-canal', 'emergency'] },
  { id: 4, name: 'Dr. Sunita Gurung', title: 'Pediatric & Hygiene Specialist', specialties: ['pediatric', 'cleaning', 'whitening'] },
  { id: 5, name: 'Dr. Bikash Thapa', title: 'Emergency & Restorative Dentist', specialties: ['emergency', 'root-canal', 'fillings'] },
  { id: 6, name: 'Dr. Pooja Karki', title: 'Cosmetic & Smile Aesthetician', specialties: ['cosmetic', 'whitening', 'implants', 'orthodontics'] },
]

const InteractiveHomeWidget: React.FC = () => {
  const navigate = useNavigate()
  const [selectedServiceId, setSelectedServiceId] = useState<string>('cleaning')

  // Calculate available doctors based on procedure selection
  const availableDoctors = homeDoctors.filter((doc) =>
    doc.specialties.includes(selectedServiceId)
  )

  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(
    availableDoctors[0]?.id || 1
  )
  const [selectedDay, setSelectedDay] = useState<number>(18)
  const [selectedTime, setSelectedTime] = useState<string>('11:30 AM')
  const [homeBookedSlots, setHomeBookedSlots] = useState<string[]>([])

  const currentDoctor =
    homeDoctors.find((d) => d.id === selectedDoctorId) || availableDoctors[0] || homeDoctors[0]

  useEffect(() => {
    if (currentDoctor && selectedDay) {
      const dateStr = `2026-09-${selectedDay < 10 ? '0' + selectedDay : selectedDay}`
      fetch(`/api/appointments/booked?dentist=${encodeURIComponent(currentDoctor.name)}&date=${dateStr}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.bookedSlots) {
            const taken = data.bookedSlots.map((s: any) => s.appointment_time)
            setHomeBookedSlots(taken)
          }
        })
        .catch((err) => console.error(err))
    }
  }, [selectedDoctorId, selectedDay])

  // When procedure changes, automatically switch to a doctor that specializes in that procedure
  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    const matchingDocs = homeDoctors.filter((doc) =>
      doc.specialties.includes(serviceId)
    )
    if (matchingDocs.length > 0) {
      setSelectedDoctorId(matchingDocs[0].id)
    }
  }

  const selectedService = homeServices.find((s) => s.id === selectedServiceId)
  const calendarDays = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]

  return (
    <div className="relative z-10 bg-paper rounded-[16px] border border-hairline shadow-sm-2 overflow-hidden">
      {/* Procedure Selector & Header */}
      <div className="p-6 border-b border-hairline bg-pebble/50 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-semibold text-slate-gray uppercase tracking-wider">
            1. Select Dental Procedure
          </label>
          <span className="pill-badge">{selectedService?.duration || 45} min</span>
        </div>
        <select
          value={selectedServiceId}
          onChange={(e) => handleServiceChange(e.target.value)}
          className="w-full bg-paper border border-hairline rounded-[8px] px-3.5 py-2 text-[14px] font-semibold text-ink-navy focus:outline-none focus:border-signal-blue"
        >
          {homeServices.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} ({s.duration} mins)
            </option>
          ))}
        </select>

        {/* Doctor Auto-assigned by Specialization */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ink-navy text-paper flex items-center justify-center font-bold text-sm">
              🩺
            </div>
            <div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
                  className="text-[15px] font-bold text-ink-navy bg-transparent focus:outline-none cursor-pointer"
                >
                  {availableDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] font-medium text-signal-blue">
                {currentDoctor?.title} (Specialist)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Date & Time Selection Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Date Selection */}
        <div>
          <h5 className="text-[14px] font-semibold text-ink-navy mb-3">
            2. Select Date (Sept 2026)
          </h5>
          <div className="grid grid-cols-7 gap-1 text-center text-[12px]">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className="text-slate-gray font-medium py-1">
                {d}
              </span>
            ))}
            {calendarDays.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setSelectedDay(num)}
                className={`py-2 rounded-[6px] transition-all font-medium cursor-pointer ${
                  selectedDay === num
                    ? 'bg-signal-blue text-paper font-bold shadow-sm'
                    : 'text-ink-navy hover:bg-pebble'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div>
          <h5 className="text-[14px] font-semibold text-ink-navy mb-3">
            3. Available Slots
          </h5>
          <div className="space-y-2">
            {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map((time) => {
              const isTaken = homeBookedSlots.includes(time) || homeBookedSlots.includes(time.replace(' AM', '').replace(' PM', ''))
              return (
                <button
                  key={time}
                  type="button"
                  disabled={isTaken}
                  onClick={() => !isTaken && setSelectedTime(time)}
                  className={`w-full py-2 px-3 rounded-[8px] text-[13px] font-medium border text-center transition-all ${
                    isTaken
                      ? 'bg-pebble text-mist-gray line-through border-hairline cursor-not-allowed'
                      : selectedTime === time
                      ? 'bg-signal-blue text-paper border-signal-blue font-semibold shadow-sm'
                      : 'border-hairline bg-paper text-ink-navy hover:border-signal-blue hover:bg-pebble'
                  }`}
                >
                  {time} {isTaken ? '(Booked)' : ''}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Widget Footer */}
      <div className="px-6 py-4 bg-pebble/30 border-t border-hairline flex items-center justify-between text-[12px] text-slate-gray">
        <div>
          <span className="font-semibold text-ink-navy">
            Selected: Sept {selectedDay}, {selectedTime}
          </span>
          <span className="block text-[11px]">with {currentDoctor?.name}</span>
        </div>
        <button
          onClick={() => navigate('/booking')}
          className="bg-signal-blue hover:bg-[#0056cc] text-paper font-semibold text-[13px] px-4 py-2 rounded-[8px] transition-colors shadow-sm cursor-pointer"
        >
          Book Now →
        </button>
      </div>
    </div>
  )
}

const Home: React.FC = () => {
  return (
    <div className="bg-cloud min-h-screen pb-20 font-sans text-ink-navy">
      {/* 64px Sticky Top Navigation Bar */}
      <Nav />

      {/* Hero Section — Two-Column Split */}
      <section className="relative pt-6 pb-20 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: 80px Editorial Headline + Copy + Stacked CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[50px] bg-[#e6f0ff] text-deep-cobalt text-[12px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-signal-blue animate-pulse"></span>
                KATHMANDU DENTAL CARE & WELLNESS
              </div>

              {/* Display & Hero Headline — 68px/80px Bold */}
              <h1 className="text-[48px] sm:text-[68px] lg:text-[76px] font-bold text-ink-navy leading-[1.1] tracking-tight font-sans">
                Easy scheduling for expert dental care.
              </h1>

              {/* Subtext — 16px weight 400 Slate Gray */}
              <p className="text-[18px] text-slate-gray leading-[1.6] max-w-[520px]">
                Book your visit in seconds. Experience gentle, modern dentistry designed around your comfort in Kathmandu.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Button variant="primary" size="lg" href="/booking">
                  Book Appointment
                </Button>
                <Button variant="dark" size="lg" href="/new-patients">
                  New Patients Info
                </Button>
              </div>

              {/* Micro Trust Info */}
              <div className="pt-4 flex items-center gap-6 text-[14px] text-slate-gray">
                <div className="flex items-center gap-2">
                  <span className="text-signal-blue font-bold">✓</span> No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-signal-blue font-bold">✓</span> Same-day emergency slots
                </div>
              </div>
            </div>

            {/* Right Column: Fully Interactive Booking Widget Card */}
            <div className="lg:col-span-6 relative mt-6 lg:mt-0">
              {/* Decorative Accent Blobs */}
              <div className="absolute -top-10 -left-10 w-72 h-72 bg-coral-magenta/30 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-sky-cyan/30 rounded-full blur-3xl pointer-events-none"></div>

              {/* Interactive Booking Widget Container */}
              <InteractiveHomeWidget />
            </div>

          </div>
        </div>
      </section>

      {/* Trust Logo Strip — Monochrome Partner Logos in #a6bbd1 */}
      <section className="py-12 border-y border-hairline bg-paper">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-center text-[12px] font-semibold uppercase tracking-wider text-slate-gray mb-8">
            TRUSTED BY PATIENTS AND INSTITUTIONS ACROSS NEPAL
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-mist-gray font-bold text-[18px] sm:text-[22px]">
            <span>NEPAL DENTAL COUNCIL</span>
            <span>KATHMANDU MEDICAL SOCIETY</span>
            <span>ISO 9001 CERTIFIED</span>
            <span>GLOBAL ORAL HEALTH</span>
          </div>
        </div>
      </section>

      {/* Section Header Block + 2-Column Feature Section */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            badgeLabel="HOW IT WORKS"
            title="Simplified dental care for busy lives"
            subtitle="We removed the friction from visiting the dentist. Seamless online booking, transparent pricing, and gentle clinical care."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Elevated Product Card 1 */}
            <Card variant="product" className="relative group">
              <div className="w-12 h-12 rounded-[12px] bg-[#e6f0ff] text-signal-blue flex items-center justify-center font-bold text-xl mb-6">
                🗓
              </div>
              <h3 className="text-[24px] font-bold text-ink-navy mb-3">Instant Online Booking</h3>
              <p className="text-[16px] text-slate-gray leading-[1.6]">
                Pick your preferred doctor, time slot, and treatment in under 60 seconds without calling.
              </p>
            </Card>

            {/* Elevated Product Card 2 */}
            <Card variant="product" className="relative group">
              <div className="w-12 h-12 rounded-[12px] bg-[#e6f0ff] text-signal-blue flex items-center justify-center font-bold text-xl mb-6">
                ⚡
              </div>
              <h3 className="text-[24px] font-bold text-ink-navy mb-3">Modern Digital Diagnostics</h3>
              <p className="text-[16px] text-slate-gray leading-[1.6]">
                Low-radiation digital 3D scans and painless ultrasonic hygiene tools for maximum accuracy.
              </p>
            </Card>

            {/* Elevated Product Card 3 */}
            <Card variant="product" className="relative group">
              <div className="w-12 h-12 rounded-[12px] bg-[#e6f0ff] text-signal-blue flex items-center justify-center font-bold text-xl mb-6">
                🛡
              </div>
              <h3 className="text-[24px] font-bold text-ink-navy mb-3">Transparent Care Plans</h3>
              <p className="text-[16px] text-slate-gray leading-[1.6]">
                Clear upfront pricing with no hidden charges. Flexible payment plans for major procedures.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Accordion Row / Highlight Section */}
      <section className="py-16 bg-paper border-y border-hairline">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Feature Accordion List */}
            <div className="lg:col-span-6 space-y-6">
              <span className="pill-badge">CLINICAL EXCELLENCE</span>
              <h2 className="text-[38px] sm:text-[50px] font-bold text-ink-navy leading-[1.2]">
                Comprehensive treatments backed by specialists
              </h2>

              <div className="space-y-4 pt-4">
                {/* Active Accordion Item */}
                <div className="p-4 rounded-[12px] bg-pebble border-l-4 border-signal-blue">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[18px] font-semibold text-ink-navy flex items-center gap-3">
                      <span className="text-signal-blue">✦</span> Dental Implants & Crowns
                    </h4>
                    <span className="text-signal-blue font-bold">→</span>
                  </div>
                  <p className="text-[14px] text-slate-gray mt-2 pl-7">
                    Permanent, natural-looking restoration using biocompatible titanium and ceramic.
                  </p>
                </div>

                {/* Inactive Accordion Item 1 */}
                <div className="p-4 rounded-[12px] border border-hairline hover:bg-pebble/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[16px] font-medium text-slate-gray flex items-center gap-3">
                      <span className="text-mist-gray">✦</span> Clear Aligners & Orthodontics
                    </h4>
                    <span className="text-mist-gray font-bold">→</span>
                  </div>
                </div>

                {/* Inactive Accordion Item 2 */}
                <div className="p-4 rounded-[12px] border border-hairline hover:bg-pebble/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[16px] font-medium text-slate-gray flex items-center gap-3">
                      <span className="text-mist-gray">✦</span> Preventive Hygiene & Polishing
                    </h4>
                    <span className="text-mist-gray font-bold">→</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Product Card with Blob */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -top-6 -right-6 w-64 h-64 bg-sky-cyan/25 rounded-full blur-2xl"></div>
              <div className="relative z-10 bg-paper rounded-[16px] border border-hairline p-8 shadow-sm-2 text-center">
                <div className="w-16 h-16 rounded-full bg-pebble text-signal-blue flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                  🦷
                </div>
                <h3 className="text-[24px] font-bold text-ink-navy mb-2">Kathmandu Studio</h3>
                <p className="text-[14px] text-slate-gray mb-6">
                  Equipped with gentle low-noise equipment and soothing clinical interiors.
                </p>
                <div className="inline-flex items-center gap-2 text-[14px] font-semibold text-signal-blue">
                  <span>View All Services</span>
                  <span>→</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Primary Action CTA Card Block */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-ink-navy rounded-[24px] p-10 md:p-16 text-center text-paper shadow-sm-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-signal-blue/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="pill-badge bg-paper/10 text-paper border border-paper/20">
                GET STARTED TODAY
              </span>
              <h2 className="text-[38px] md:text-[50px] font-bold leading-[1.2] text-paper">
                Ready for a comfortable dental experience?
              </h2>
              <p className="text-[16px] md:text-[18px] text-mist-gray leading-[1.5]">
                Book your first visit online or speak directly with our care coordinator team.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="primary" size="lg" href="/booking">
                  Schedule Your Visit
                </Button>
                <Button variant="outline" size="lg" href="/contact" className="border-paper/40 text-paper hover:bg-paper/10 hover:border-paper">
                  Contact Clinic
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Surface (Cloud #f8f9fb) */}
      <footer className="bg-cloud pt-16 pb-12 border-t border-hairline">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-[6px] bg-ink-navy text-paper flex items-center justify-center font-bold text-xs">
                ✦
              </div>
              <span className="text-[18px] font-bold text-ink-navy">KathmanduDental</span>
            </div>
            <p className="text-[14px] text-slate-gray leading-[1.5]">
              Expert dental care with humanist warmth in Kathmandu, Nepal.
            </p>
          </div>

          <div>
            <h5 className="text-[12px] font-semibold text-slate-gray uppercase tracking-wider mb-4">Quick Links</h5>
            <ul className="space-y-2.5 text-[14px] text-ink-navy font-medium">
              <li><Link to="/services" className="hover:text-signal-blue">Services</Link></li>
              <li><Link to="/about" className="hover:text-signal-blue">About Us</Link></li>
              <li><Link to="/new-patients" className="hover:text-signal-blue">New Patients</Link></li>
              <li><Link to="/contact" className="hover:text-signal-blue">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[12px] font-semibold text-slate-gray uppercase tracking-wider mb-4">Services</h5>
            <ul className="space-y-2.5 text-[14px] text-ink-navy font-medium">
              <li><Link to="/services" className="hover:text-signal-blue">Dental Implants</Link></li>
              <li><Link to="/services" className="hover:text-signal-blue">Orthodontics</Link></li>
              <li><Link to="/services" className="hover:text-signal-blue">Teeth Whitening</Link></li>
              <li><Link to="/services" className="hover:text-signal-blue">Emergency Care</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[12px] font-semibold text-slate-gray uppercase tracking-wider mb-4">Contact</h5>
            <p className="text-[14px] text-slate-gray mb-2">Durbar Marg, Kathmandu</p>
            <p className="text-[14px] text-slate-gray mb-2">Phone: +977 1-4000000</p>
            <p className="text-[14px] text-slate-gray">Email: care@kathmandudental.com</p>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 mt-12 pt-6 border-t border-hairline text-center text-[12px] text-slate-gray">
          © {new Date().getFullYear()} Kathmandu Dental Care. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Home