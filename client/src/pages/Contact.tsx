import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Nav from '../components/Nav'
import SectionHeader from '../components/SectionHeader'
import Card from '../components/Card'
import Button from '../components/Button'

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'),
    email: z.string().email('Please enter a valid email address'),
    subject: z.string().min(3, 'Subject must be at least 3 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters')
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      subject: '',
      message: ''
    }
  })

  const onSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      reset()
    }, 1200)
  }

  if (isSubmitted) {
    return (
      <div className="bg-cream min-h-screen pb-24">
        <Nav />
        <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
          <Card variant="white" className="p-12 shadow-warm-xl">
            <div className="w-16 h-16 rounded-full bg-forest/20 text-forest text-3xl flex items-center justify-center mx-auto mb-6">
              ✓
            </div>
            <h1 className="text-4xl font-reckless text-deep-ink mb-4 font-normal">Thank You for Reaching Out!</h1>
            <p className="text-base font-saans text-deep-ink/80 mb-8 leading-[1.6]">
              We have received your message. Our Kathmandu clinic team will contact you within 24 hours.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="primary" size="md" href="/">
                Return to Home
              </Button>
              <Button variant="outline" size="md" href="/services">
                Explore Services
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen pb-24">
      <Nav />

      {/* Hero Section */}
      <section className="py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            badgeLabel="GET IN TOUCH"
            title="We Are Here to Help Your Smile"
            subtitle="Reach out with any questions, scheduling requests, or dental emergency inquiries."
          />
        </div>
      </section>

      {/* Contact Info & Map */}
      <section className="py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact Details Card */}
            <Card variant="white" className="shadow-warm-md flex flex-col justify-between">
              <div>
                <span className="badge-pill mb-4">CLINIC DETAILS</span>
                <h2 className="text-3xl font-reckless text-deep-ink mb-6 font-normal">Visit Our Kathmandu Studio</h2>

                <div className="space-y-6 text-sm font-saans text-deep-ink/80">
                  <div className="flex items-start gap-4">
                    <span className="text-xl">📍</span>
                    <div>
                      <h3 className="font-medium text-deep-ink">Address</h3>
                      <p>Kathmandu Dental Care, Thamel, Kathmandu 44600, Nepal</p>
                      <span className="text-xs text-stone/70">(Near Thamel Chowk, opposite Himalayan Java)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="text-xl">📞</span>
                    <div>
                      <h3 className="font-medium text-deep-ink">Phone & Emergency</h3>
                      <p><a href="tel:+97714221234" className="text-primary-indigo hover:underline">+977 1-4221234</a></p>
                      <span className="text-xs text-forest font-medium">24/7 Emergency Line Active</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="text-xl">✉️</span>
                    <div>
                      <h3 className="font-medium text-deep-ink">Email</h3>
                      <p><a href="mailto:info@kathmandudental.com.np" className="text-primary-indigo hover:underline">info@kathmandudental.com.np</a></p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="text-xl">🕒</span>
                    <div>
                      <h3 className="font-medium text-deep-ink">Clinic Hours</h3>
                      <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
                      <p>Sat: 9:00 AM - 1:00 PM | Sun: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Map Preview */}
            <Card variant="tinted" tintColor="blossom" className="flex flex-col items-center justify-center text-center shadow-warm-md">
              <div className="w-16 h-16 rounded-full bg-pure-white shadow-sm flex items-center justify-center text-3xl mb-4">
                🗺️
              </div>
              <h3 className="text-2xl font-reckless text-deep-ink mb-2 font-normal">Kathmandu Studio Map</h3>
              <p className="text-sm font-saans text-deep-ink/80 max-w-sm mb-6">
                Conveniently located in central Thamel with dedicated parking for patients.
              </p>
              <Button variant="primary" size="md" onClick={() => window.open('https://maps.google.com', '_blank')}>
                Open Directions in Google Maps
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="max-w-[800px] mx-auto px-4">
          <Card variant="white" className="shadow-warm-xl border border-stone/10">
            <SectionHeader
              badgeLabel="SEND A MESSAGE"
              title="Leave Us a Direct Message"
              subtitle="Fill out the form below and we'll reply promptly."
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-saans uppercase tracking-wider text-deep-ink mb-2 font-medium">Full Name</label>
                  <input
                    {...register('name')}
                    className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo font-saans text-sm"
                    placeholder="e.g. Anil Thapa"
                  />
                  {errors.name && <p className="text-ember text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-saans uppercase tracking-wider text-deep-ink mb-2 font-medium">Phone Number</label>
                  <input
                    {...register('phone')}
                    className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo font-saans text-sm"
                    placeholder="+977-98XXXXXXXX"
                  />
                  {errors.phone && <p className="text-ember text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-saans uppercase tracking-wider text-deep-ink mb-2 font-medium">Email Address</label>
                <input
                  {...register('email')}
                  className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo font-saans text-sm"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-ember text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-saans uppercase tracking-wider text-deep-ink mb-2 font-medium">Subject</label>
                <input
                  {...register('subject')}
                  className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo font-saans text-sm"
                  placeholder="Subject of your message"
                />
                {errors.subject && <p className="text-ember text-xs mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-saans uppercase tracking-wider text-deep-ink mb-2 font-medium">Message</label>
                <textarea
                  {...register('message')}
                  className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-indigo font-saans text-sm"
                  placeholder="How can we assist you?"
                  rows={4}
                />
                {errors.message && <p className="text-ember text-xs mt-1">{errors.message.message}</p>}
              </div>

              <Button variant="primary" size="lg" className="w-full">
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Contact