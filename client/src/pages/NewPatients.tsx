import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import SectionHeader from '../components/SectionHeader'
import Card from '../components/Card'
import Button from '../components/Button'

const NewPatients: React.FC = () => {
  return (
    <div className="bg-cream min-h-screen pb-24">
      <Nav />

      {/* Hero Section */}
      <section className="py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            badgeLabel="WELCOME TO AUGUST DENTAL"
            title="Your First Visit Experience"
            subtitle="We're excited to welcome you to our Kathmandu clinic. Here is everything you need to know for your first appointment."
          />

          <div className="flex justify-center gap-4 mb-16">
            <Button variant="primary" size="lg" href="/booking">
              Schedule First Visit
            </Button>
            <Button variant="outline" size="lg" onClick={() => alert('Please arrive 15 minutes early to complete check-in.')}>
              New Patient Guidelines
            </Button>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 bg-pure-white/60 border-y border-stone/10">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            badgeLabel="WHAT TO EXPECT"
            title="A Calm, Thoughtful Journey From Start to Finish"
          />

          <div className="grid gap-8 md:grid-cols-2">
            <Card variant="white" className="shadow-warm-sm">
              <div className="w-10 h-10 rounded-full bg-blossom/30 text-deep-ink flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-2xl font-reckless text-deep-ink mb-3 font-normal">Warm Welcome</h3>
              <p className="text-base font-saans text-deep-ink/80 leading-[1.6]">
                Our concierge team greets you with a warm drink in our quiet lounge, helping you check in comfortably.
              </p>
            </Card>

            <Card variant="white" className="shadow-warm-sm">
              <div className="w-10 h-10 rounded-full bg-petal text-deep-ink flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-2xl font-reckless text-deep-ink mb-3 font-normal">Comprehensive Exam</h3>
              <p className="text-base font-saans text-deep-ink/80 leading-[1.6]">
                Low-radiation digital 3D scans and gentle intraoral photography so you can see exactly what your doctor sees.
              </p>
            </Card>

            <Card variant="white" className="shadow-warm-sm">
              <div className="w-10 h-10 rounded-full bg-forest/20 text-forest flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-2xl font-reckless text-deep-ink mb-3 font-normal">Personalized Plan</h3>
              <p className="text-base font-saans text-deep-ink/80 leading-[1.6]">
                We co-create a clear treatment plan tailored to your health goals, preferences, and timeline.
              </p>
            </Card>

            <Card variant="white" className="shadow-warm-sm">
              <div className="w-10 h-10 rounded-full bg-ember/20 text-ember flex items-center justify-center font-bold mb-4">
                4
              </div>
              <h3 className="text-2xl font-reckless text-deep-ink mb-3 font-normal">Transparent Pricing</h3>
              <p className="text-base font-saans text-deep-ink/80 leading-[1.6]">
                No hidden fees or unexpected costs. We explain itemized costs and payment options prior to any procedure.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Patient Forms Section */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            badgeLabel="FORMS & DOWNLOADS"
            title="Save Time Before Your Appointment"
            subtitle="Download and review essential forms prior to your visit."
          />

          <div className="grid gap-6 md:grid-cols-3">
            <Card variant="tinted" tintColor="blossom" className="flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-reckless text-deep-ink mb-3 font-normal">Registration Form</h3>
                <p className="text-sm font-saans text-deep-ink/80 mb-6">Basic contact and insurance information form.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => alert('Downloading Patient Registration Form (PDF)...')}>
                Download PDF
              </Button>
            </Card>

            <Card variant="tinted" tintColor="forest" className="flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-reckless text-deep-ink mb-3 font-normal">Medical History Form</h3>
                <p className="text-sm font-saans text-deep-ink/80 mb-6">Health history questionnaire for safe care.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => alert('Downloading Medical History Form (PDF)...')}>
                Download PDF
              </Button>
            </Card>

            <Card variant="tinted" tintColor="ember" className="flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-reckless text-deep-ink mb-3 font-normal">Privacy & Consent</h3>
                <p className="text-sm font-saans text-deep-ink/80 mb-6">Patient rights and privacy acknowledgment.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => alert('Downloading Consent Form (PDF)...')}>
                Download PDF
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Insurance & Payment */}
      <section className="py-16 bg-pure-white border-y border-stone/10">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Insurance Accepted</h3>
              <p className="text-gray-700">
                We work with major insurance providers to maximize your benefits. Please bring your insurance card to your first visit.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Please contact us to verify if your specific plan is accepted.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Financing & Payment Options</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Cash, Credit/Debit Cards (Visa, MasterCard)</li>
                <li>Mobile Wallets (eSewa, Khalti, IME Pay)</li>
                <li>Bank Transfers</li>
                <li>In-house Payment Plans for Major Treatments</li>
                <li>Third-party Healthcare Financing Partners</li>
              </ul>
              <p className="mt-4 text-sm text-gray-500">
                We provide detailed cost estimates before any treatment begins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Dental Journey?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Schedule your first visit today and experience our patient-centered approach to dental care.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/booking" className="bg-primary text-white px-8 py-3 rounded-md">
                Book Your First Appointment
              </Link>
              <Link to="/services" className="border border-primary text-primary px-8 py-3 rounded-md">
                Explore Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NewPatients