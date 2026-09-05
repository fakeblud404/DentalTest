import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import Button from '../components/Button';

const services = [
  { id: 'cleaning', title: 'Cleanings & Prevention', description: 'Regular checkups, cleanings, and preventive care to maintain optimal oral health', tint: 'blossom', icon: '✨' },
  { id: 'fillings', title: 'Fillings & Restorations', description: 'Tooth-colored fillings and dental restorations for lasting oral health', tint: 'petal', icon: '🦷' },
  { id: 'root-canal', title: 'Root Canal Therapy', description: 'Gentle treatment to save infected teeth and relieve pain', tint: 'ember', icon: '⚡' },
  { id: 'implants', title: 'Dental Implants', description: 'Permanent solution for missing teeth with natural look and feel', tint: 'forest', icon: '💎' },
  { id: 'orthodontics', title: 'Orthodontics & Invisalign', description: 'Braces and clear aligners for straighter, healthier smiles', tint: 'meadow', icon: '😁' },
  { id: 'whitening', title: 'Teeth Whitening', description: 'Professional whitening for brighter smiles and enhanced confidence', tint: 'blossom', icon: '☀️' },
  { id: 'emergency', title: 'Emergency Dental Care', description: 'Same-day care for dental emergencies, including trauma and pain relief', tint: 'ember', icon: '🚨' },
  { id: 'pediatric', title: 'Pediatric Dentistry', description: 'Gentle dental care for children in a fun, friendly environment', tint: 'petal', icon: '🧸' },
  { id: 'cosmetic', title: 'Cosmetic Dentistry', description: 'Veneers, bonding, and smile makeovers for aesthetic enhancement', tint: 'forest', icon: '🎨' }
];

const Services: React.FC = () => {
  return (
    <div className="bg-cream min-h-screen pb-24">
      <Nav />

      <section className="py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            badgeLabel="OUR SERVICES"
            title="Comprehensive Dental Care Services"
            subtitle="Expert care for every member of your family, from preventive treatments to advanced restorative procedures."
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map(service => (
              <Link key={service.id} to={`/services/${service.id}`} className="group block">
                <Card variant="tinted" tintColor={service.tint as any} className="h-full flex flex-col justify-between hover:shadow-warm-lg">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-full bg-pure-white shadow-sm flex items-center justify-center text-2xl">
                        {service.icon}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-pure-white text-deep-ink group-hover:bg-primary-indigo group-hover:text-pure-white transition-colors flex items-center justify-center font-bold text-xs">
                        ↗
                      </div>
                    </div>
                    <h3 className="text-2xl font-reckless text-deep-ink mb-3 font-normal">
                      {service.title}
                    </h3>
                    <p className="text-base font-saans text-deep-ink/80 leading-[1.6]">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-deep-ink/10 flex items-center text-sm font-saans font-medium text-primary-indigo">
                    View Details & Pricing <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="mt-20 bg-pure-white rounded-[24px] p-10 md:p-12 shadow-warm-lg flex flex-col md:flex-row items-center justify-between gap-8 border border-stone/10">
            <div>
              <span className="badge-pill mb-3">GET STARTED TODAY</span>
              <h2 className="text-3xl md:text-4xl font-reckless text-deep-ink mb-3 font-normal">Ready to Transform Your Smile?</h2>
              <p className="text-base font-saans text-deep-ink/80 max-w-xl">
                Schedule your consultation today and experience warm, patient-centered care in Kathmandu.
              </p>
            </div>
            <Button variant="primary" size="lg" href="/booking">
              Book Your Appointment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
