import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import SectionHeader from '../components/SectionHeader'
import Card from '../components/Card'
import Button from '../components/Button'

const blogPosts = [
  {
    id: 1,
    title: '5 Signs You Need to See a Dentist Immediately',
    excerpt: 'Ignoring dental pain can lead to serious complications. Learn the warning signs that require immediate dental attention.',
    date: 'September 1, 2026',
    category: 'Emergency Care',
    readTime: '5 min read',
    tint: 'ember'
  },
  {
    id: 2,
    title: 'The Complete Guide to Dental Implants in Kathmandu',
    excerpt: 'Everything you need to know about dental implants: procedure, benefits, costs, and aftercare.',
    date: 'August 25, 2026',
    category: 'Implants',
    readTime: '8 min read',
    tint: 'forest'
  },
  {
    id: 3,
    title: 'Invisalign vs Traditional Braces: Which is Right for You?',
    excerpt: 'Compare the pros and cons of Invisalign clear aligners and traditional braces to make the best choice for your smile.',
    date: 'August 18, 2026',
    category: 'Orthodontics',
    readTime: '6 min read',
    tint: 'blossom'
  },
  {
    id: 4,
    title: 'Oral Health Tips for Diabetic Patients',
    excerpt: 'Special considerations for maintaining oral health when managing diabetes.',
    date: 'August 10, 2026',
    category: 'Oral Health',
    readTime: '4 min read',
    tint: 'petal'
  },
  {
    id: 5,
    title: 'Pediatric Dental Care: When Should Your Child First See a Dentist?',
    excerpt: 'Early dental visits set the foundation for lifelong oral health. Learn when and why to start dental care for children.',
    date: 'August 3, 2026',
    category: 'Pediatric Care',
    readTime: '5 min read',
    tint: 'blossom'
  },
  {
    id: 6,
    title: 'Teeth Whitening: Professional vs Over-the-Counter Options',
    excerpt: 'Discover the differences between professional whitening treatments and store-bought products.',
    date: 'July 28, 2026',
    category: 'Cosmetic',
    readTime: '5 min read',
    tint: 'ember'
  }
]

const Blog: React.FC = () => {
  return (
    <div className="bg-cream min-h-screen pb-24">
      <Nav />

      {/* Hero Section */}
      <section className="py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            badgeLabel="CLINICAL INSIGHTS & JOURNAL"
            title="Dental Education & Wellness Guides"
            subtitle="Expert advice, preventive care tips, and treatment insights from our Kathmandu clinical team."
          />
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map(post => (
              <Card key={post.id} variant="tinted" tintColor={post.tint as any} className="flex flex-col justify-between hover:shadow-warm-lg transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge-pill">{post.category}</span>
                    <span className="text-xs font-saans text-deep-ink/60">{post.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-reckless text-deep-ink mb-3 font-normal leading-[1.2]">
                    {post.title}
                  </h3>
                  <p className="text-sm font-saans text-deep-ink/80 mb-6 leading-[1.6]">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-4 border-t border-deep-ink/10 flex items-center justify-between text-xs font-saans">
                  <span className="text-stone/70">{post.date}</span>
                  <span className="text-primary-indigo font-medium hover:underline cursor-pointer">Read Article →</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Blog;