import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <svg className="w-20 h-20 text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3M6 6h.01M12 8h.01M12 12h.01M12 16h.01" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex space-x-4">
          <Link to="/" className="btn-primary px-6 py-3">
            Return to Home
          </Link>
          <Link to="/services" className="btn-outline px-6 py-3">
            Explore Services
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound