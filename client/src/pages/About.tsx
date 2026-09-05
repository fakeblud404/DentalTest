import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import SectionHeader from '../components/SectionHeader'
import Card from '../components/Card'
import Button from '../components/Button'

const About: React.FC = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Rajesh Shrestha',
      title: 'Lead Dentist & Implant Specialist',
      bio: 'Dr. Shrestha has over 15 years of experience in implant dentistry and full-mouth rehabilitation. He regularly speaks at international dental conferences.',
      specialties: ['Dental Implants', 'Cosmetic Dentistry', 'Full Mouth Rehabilitation'],
      halo: 'bg-ember',
      avatar: '👨‍⚕️'
    },
    {
      id: 2,
      name: 'Dr. Ananya Sharma',
      title: 'Orthodontist & Pediatric Specialist',
      bio: 'Dr. Sharma specializes in clear aligners and gentle pediatric dentistry. Her approachable care puts patients of all ages at ease.',
      specialties: ['Orthodontics', 'Invisalign', 'Pediatric Care'],
      halo: 'bg-blossom',
      avatar: '👩‍⚕️'
    },
    {
      id: 3,
      name: 'Dr. Rajiv Patel',
      title: 'Restorative & Preventive Specialist',
      bio: 'Dr. Patel focuses on minimal-intervention dentistry, preserving natural tooth structure with advanced restorative materials.',
      specialties: ['Cleanings & Prevention', 'Fillings', 'Root Canal Therapy'],
      halo: 'bg-forest',
      avatar: '👨‍⚕️'
    }
  ]

  const clinicStats = [
    { value: '15+', label: 'Years of Excellence' },
    { value: '10,000+', label: 'Happy Patients' },
    { value: '99%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Emergency Support' }
  ]

  return (
    <div className="bg-cream min-h-screen pb-24">
      <Nav />

      {/* Hero Section */}
      <section className="py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            badgeLabel="OUR PHILOSOPHY"
            title="Humanist Clinical Surface Softening Healthcare's Sterility"
            subtitle="Founded with a mission to bring compassionate, world-class dental care to Kathmandu."
          />

          <div className="flex justify-center gap-4 mb-16">
            <Button variant="primary" size="lg" href="/booking">
              Book Appointment
            </Button>
            <Button variant="outline" size="lg" href="/new-patients">
              New Patients Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-pure-white/60 border-y border-stone/10">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge-pill mb-4">OUR STORY</span>
            <h2 className="text-3xl md:text-5xl font-reckless text-deep-ink mb-6 font-normal">
              A Decade of Dedicated Care in Kathmandu
            </h2>
            <p className="text-base md:text-lg font-saans text-deep-ink/80 mb-6 leading-[1.6]">
              Founded in 2010, Kathmandu Dental Care began with a vision: replacing cold, sterile clinical environments with warm, supportive pharmacy aesthetics. Over the past decade, we've grown into Kathmandu's premier multidisciplinary dental studio.
            </p>
            <p className="text-base font-saans text-deep-ink/80 leading-[1.6]">
              We combine computer-guided precision tech with soft, comfortable patient experiences to ensure every visit feels calm, transparent, and restorative.
            </p>
          </div>
        </div>
      </section>

      {/* Clinic Stats */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-4 text-center">
            {clinicStats.map((stat, index) => (
              <Card key={index} variant="white" className="shadow-warm-sm border border-stone/5">
                <div className="text-4xl font-reckless text-primary-indigo mb-2 font-normal">
                  {stat.value}
                </div>
                <p className="text-sm font-saans font-medium text-deep-ink/70">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            badgeLabel="OUR SPECIALISTS"
            title="Meet Our Experienced Dental Team"
            subtitle="Accredited doctors dedicated to patient comfort and continuous clinical innovation."
          />

          <div className="grid gap-8 md:grid-cols-3">
            {teamMembers.map(member => (
              <Card key={member.id} variant="white" className="flex flex-col items-center text-center shadow-warm-md">
                {/* Circular Portrait Frame */}
                <div className={`w-32 h-32 rounded-full p-2 ${member.halo} shadow-warm-md mb-6 flex items-center justify-center`}>
                  <div className="w-full h-full rounded-full bg-cream border-2 border-pure-white flex items-center justify-center text-4xl">
                    {member.avatar}
                  </div>
                </div>

                <h3 className="text-2xl font-reckless text-deep-ink mb-1 font-normal">{member.name}</h3>
                <p className="text-xs font-saans font-medium text-primary-indigo uppercase tracking-wider mb-4">{member.title}</p>
                <p className="text-sm font-saans text-deep-ink/80 mb-6 leading-[1.6]">{member.bio}</p>

                <div className="flex flex-wrap gap-1.5 justify-center mt-auto">
                  {member.specialties.map((spec, i) => (
                    <span key={i} className="text-[11px] font-saans bg-cream text-deep-ink px-2.5 py-1 rounded-full border border-stone/10">
                      {spec}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About