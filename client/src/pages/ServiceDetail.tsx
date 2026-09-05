import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Nav from '../components/Nav'
import Card from '../components/Card'
import Button from '../components/Button'

// Mock service data
const serviceData: Record<string, any> = {
  cleaning: {
    id: 'cleaning',
    title: 'Cleanings & Prevention',
    description: 'Regular dental cleanings and preventive care are essential for maintaining optimal oral health and preventing dental problems before they start.',
    indications: [
      'Regular maintenance of oral health',
      'Prevention of cavities and gum disease',
      'Early detection of dental issues',
      'Professional removal of plaque and tartar'
    ],
    process: [
      { step: 1, title: 'Examination', description: 'Comprehensive oral exam including X-rays if needed', duration: '10-15 minutes' },
      { step: 2, title: 'Cleaning', description: 'Removal of plaque, tartar, and stains', duration: '20-30 minutes' },
      { step: 3, title: 'Polishing', description: 'Teeth polishing for smooth surface', duration: '5-10 minutes' },
      { step: 4, title: 'Fluoride Treatment', description: 'Optional fluoride application for cavity protection', duration: '5 minutes' }
    ],
    faqs: [
      { question: 'How often should I get a dental cleaning?', answer: 'Most patients should get a cleaning every 6 months, though some may need more frequent visits based on their oral health.' },
      { question: 'Is dental cleaning painful?', answer: 'Modern cleaning techniques are gentle and typically painless. We use ultrasonic scalers and hand instruments for comfort.' },
      { question: 'How long does a cleaning appointment take?', answer: 'A typical cleaning appointment takes 45-60 minutes, including examination and cleaning.' }
    ],
    priceRange: '₹1,500 - ₹3,000',
  },
  implants: {
    id: 'implants',
    title: 'Dental Implants',
    description: 'Dental implants are a permanent solution for missing teeth that look, feel, and function like natural teeth.',
    indications: [
      'Missing one or more teeth',
      'Loose or uncomfortable dentures',
      'Desire for permanent tooth replacement',
      'Sufficient jawbone density'
    ],
    process: [
      { step: 1, title: 'Consultation & Planning', description: 'Comprehensive exam, 3D imaging, and treatment planning', duration: '1-2 visits' },
      { step: 2, title: 'Implant Placement', description: 'Surgical placement of titanium implant post', duration: '1-2 hours' },
      { step: 3, title: 'Healing Period', description: 'Osseointegration - implant fuses with jawbone', duration: '3-6 months' },
      { step: 4, title: 'Crown Attachment', description: 'Attachment of custom-made crown to implant', duration: '1 visit' }
    ],
    faqs: [
      { question: 'Is the implant procedure painful?', answer: 'The procedure is performed under local anesthesia, so you won\'t feel pain during surgery. Some discomfort during healing is normal and manageable.' },
      { question: 'How long do dental implants last?', answer: 'With proper care, dental implants can last 20+ years or even a lifetime.' },
      { question: 'Am I a candidate for dental implants?', answer: 'Most adults with good oral and general health are candidates. A consultation will determine your suitability.' },
      { question: 'What is the cost of dental implants?', answer: 'Cost varies based on number of implants and complexity. We provide detailed estimates during consultation.' }
    ],
    priceRange: '₹40,000 - ₹80,000 per implant',
  },
  orthodontics: {
    id: 'orthodontics',
    title: 'Orthodontics & Invisalign',
    description: 'Straighten your teeth with traditional braces or clear Invisalign aligners for a healthier, more confident smile.',
    indications: [
      'Crooked or misaligned teeth',
      'Overbite, underbite, or crossbite',
      'Gaps between teeth',
      'Jaw alignment issues'
    ],
    process: [
      { step: 1, title: 'Consultation & Scan', description: 'Digital impressions and treatment planning', duration: '1 visit' },
      { step: 2, title: 'Treatment Begins', description: 'Placement of braces or first set of aligners', duration: '1 visit' },
      { step: 3, title: 'Regular Adjustments', description: 'Monthly check-ups and adjustments', duration: 'Throughout treatment' },
      { step: 4, title: 'Treatment Completion', description: 'Removal of braces or final aligners, retainer fitting', duration: '1 visit' }
    ],
    faqs: [
      { question: 'How long does orthodontic treatment take?', answer: 'Treatment typically takes 12-24 months, depending on the complexity of the case.' },
      { question: 'What\'s the difference between braces and Invisalign?', answer: 'Braces use metal brackets and wires, while Invisalign uses clear, removable aligners. Invisalign is more discreet but may not suit all cases.' },
      { question: 'Is orthodontic treatment painful?', answer: 'Some discomfort is normal after adjustments, but it\'s usually mild and temporary.' }
    ],
    priceRange: '₹60,000 - ₹1,50,000',
  }
}

const defaultService = {
  id: 'cleaning',
  title: 'Cleanings & Prevention',
  description: 'Regular dental cleanings and preventive care',
  indications: ['Regular maintenance', 'Prevention of cavities'],
  process: [{ step: 1, title: 'Examination', description: 'Oral exam', duration: '15 minutes' }],
  faqs: [{ question: 'How often should I visit?', answer: 'Every 6 months for most patients.' }],
  priceRange: '₹1,500 - ₹3,000',
}

const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const service = serviceData[serviceId as keyof typeof serviceData] || defaultService
  const [selectedTab, setSelectedTab] = useState<'about' | 'process' | 'faqs'>('about')

  const bookingSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'),
    email: z.string().email('Please enter a valid email address'),
    preferredDate: z.string().min(1, 'Please select a date'),
    preferredTime: z.string().min(1, 'Please select a time'),
    message: z.string().optional()
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
  })

  const onSubmit = (data: z.infer<typeof bookingSchema>) => {
    alert('Thank you! We\'ve received your consultation request and will contact you shortly.')
    reset()
    navigate('/booking')
  }

  return (
    <div className="bg-cream min-h-screen pb-24">
      <Nav />

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Back Link */}
        <Link to="/services" className="inline-flex items-center text-sm font-saans font-medium text-deep-ink/70 hover:text-primary-indigo mb-8 transition-colors">
          ← Back to All Services
        </Link>

        {/* Page Header Header */}
        <div className="bg-pure-white rounded-[24px] p-8 md:p-12 shadow-warm-md border border-stone/10 mb-12">
          <span className="badge-pill mb-4">CLINICAL TREATMENT</span>
          <h1 className="text-4xl md:text-6xl font-reckless text-deep-ink mb-6 font-normal">
            {service.title}
          </h1>
          <p className="text-lg md:text-xl font-saans text-deep-ink/80 max-w-3xl mb-8 leading-[1.5]">
            {service.description}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="px-4 py-2 rounded-full bg-info-blue/60 text-deep-ink font-saans font-medium text-sm">
              Estimated Investment: {service.priceRange}
            </span>
            <Button variant="primary" size="lg" href="/booking">
              Book Consultation
            </Button>
          </div>
        </div>

        {/* Pill Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-pure-white/80 p-2 rounded-full border border-stone/10 max-w-xl">
          <button
            onClick={() => setSelectedTab('about')}
            className={`flex-1 py-2.5 px-4 rounded-full font-saans text-sm font-medium transition-all ${
              selectedTab === 'about'
                ? 'bg-primary-indigo text-pure-white shadow-sm'
                : 'text-deep-ink/70 hover:text-deep-ink'
            }`}
          >
            About Treatment
          </button>
          <button
            onClick={() => setSelectedTab('process')}
            className={`flex-1 py-2.5 px-4 rounded-full font-saans text-sm font-medium transition-all ${
              selectedTab === 'process'
                ? 'bg-primary-indigo text-pure-white shadow-sm'
                : 'text-deep-ink/70 hover:text-deep-ink'
            }`}
          >
            Treatment Process
          </button>
          <button
            onClick={() => setSelectedTab('faqs')}
            className={`flex-1 py-2.5 px-4 rounded-full font-saans text-sm font-medium transition-all ${
              selectedTab === 'faqs'
                ? 'bg-primary-indigo text-pure-white shadow-sm'
                : 'text-deep-ink/70 hover:text-deep-ink'
            }`}
          >
            FAQs
          </button>
        </div>

        {/* Tab Content */}
        {selectedTab === 'about' && (
          <Card variant="white" className="shadow-warm-md mb-12">
            <h2 className="text-2xl font-reckless text-deep-ink mb-6 font-normal">Who Needs This Treatment?</h2>
            <ul className="space-y-4">
              {service.indications.map((indication: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-base font-saans text-deep-ink/80">
                  <span className="w-6 h-6 rounded-full bg-forest/20 text-forest flex items-center justify-center text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  {indication}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {selectedTab === 'process' && (
          <div className="space-y-6 mb-12">
            {service.process.map((step: any) => (
              <Card key={step.step} variant="white" className="flex items-start gap-6 shadow-warm-sm">
                <div className="w-12 h-12 rounded-full bg-primary-indigo text-pure-white font-reckless text-xl font-normal flex items-center justify-center flex-shrink-0">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-reckless text-deep-ink mb-2 font-normal">{step.title}</h3>
                  <p className="text-base font-saans text-deep-ink/80 mb-2">{step.description}</p>
                  <span className="text-xs font-saans font-medium text-stone bg-cream px-3 py-1 rounded-full inline-block">
                    Duration: {step.duration}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'faqs' && (
          <div className="space-y-4 mb-12">
            {service.faqs.map((faq: any, index: number) => (
              <Card key={index} variant="white" className="shadow-warm-sm">
                <h3 className="text-xl font-reckless text-deep-ink mb-3 font-normal">{faq.question}</h3>
                <p className="text-base font-saans text-deep-ink/80 leading-[1.6]">{faq.answer}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Booking Form Section */}
        <section className="bg-pure-white rounded-[24px] p-8 md:p-12 shadow-warm-xl border border-stone/10">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <span className="badge-pill mb-3">APPOINTMENT REQUEST</span>
              <h2 className="text-3xl font-reckless text-deep-ink mb-2 font-normal">Schedule Your Consultation</h2>
              <p className="text-base font-saans text-deep-ink/70">Fill out your details below and our Kathmandu team will get in touch.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-saans uppercase tracking-wider text-deep-ink mb-2 font-medium">Full Name</label>
                  <input
                    {...register('name')}
                    className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo font-saans text-sm"
                    placeholder="e.g. Maya Shrestha"
                  />
                  {errors.name && <p className="text-ember text-xs mt-1">{errors.name.message as string}</p>}
                </div>
                <div>
                  <label className="block text-xs font-saans uppercase tracking-wider text-deep-ink mb-2 font-medium">Phone Number</label>
                  <input
                    {...register('phone')}
                    className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo font-saans text-sm"
                    placeholder="+977-98XXXXXXXX"
                  />
                  {errors.phone && <p className="text-ember text-xs mt-1">{errors.phone.message as string}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-saans uppercase tracking-wider text-deep-ink mb-2 font-medium">Email Address</label>
                <input
                  {...register('email')}
                  className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo font-saans text-sm"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-ember text-xs mt-1">{errors.email.message as string}</p>}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-saans uppercase tracking-wider text-deep-ink mb-2 font-medium">Preferred Date</label>
                  <input
                    type="date"
                    {...register('preferredDate')}
                    className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo font-saans text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-saans uppercase tracking-wider text-deep-ink mb-2 font-medium">Preferred Time</label>
                  <input
                    type="time"
                    {...register('preferredTime')}
                    className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo font-saans text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-saans uppercase tracking-wider text-deep-ink mb-2 font-medium">Additional Details</label>
                <textarea
                  {...register('message')}
                  className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo font-saans text-sm"
                  placeholder="Share any dental concerns or notes for your visit..."
                  rows={3}
                />
              </div>

              <Button variant="primary" size="lg" className="w-full">
                Submit Consultation Request
              </Button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ServiceDetail