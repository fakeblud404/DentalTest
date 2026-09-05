import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Nav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-md border-b border-hairline h-[64px] flex items-center mb-8">
      <nav className="max-w-[1200px] w-full mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-[8px] bg-ink-navy text-paper flex items-center justify-center font-bold text-sm">
              ✦
            </div>
            <span className="text-[20px] font-bold font-sans text-ink-navy tracking-tight">
              Kathmandu<span className="text-signal-blue font-extrabold">Dental</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-[14px] font-medium font-sans transition-colors ${
                isActive('/') ? 'text-signal-blue font-semibold' : 'text-ink-navy hover:text-signal-blue'
              }`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`text-[14px] font-medium font-sans transition-colors ${
                isActive('/services') ? 'text-signal-blue font-semibold' : 'text-ink-navy hover:text-signal-blue'
              }`}
            >
              Services
            </Link>
            <Link
              to="/about"
              className={`text-[14px] font-medium font-sans transition-colors ${
                isActive('/about') ? 'text-signal-blue font-semibold' : 'text-ink-navy hover:text-signal-blue'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/new-patients"
              className={`text-[14px] font-medium font-sans transition-colors ${
                isActive('/new-patients') ? 'text-signal-blue font-semibold' : 'text-ink-navy hover:text-signal-blue'
              }`}
            >
              New Patients
            </Link>

            <Link
              to="/contact"
              className={`text-[14px] font-medium font-sans transition-colors ${
                isActive('/contact') ? 'text-signal-blue font-semibold' : 'text-ink-navy hover:text-signal-blue'
              }`}
            >
              Contact
            </Link>
          </div>
        </div>

        {/* CTA Buttons Cluster */}
        <div className="flex items-center space-x-3">
          <Link
            to="/booking"
            className="bg-signal-blue text-paper hover:bg-[#0056cc] text-[14px] font-semibold font-sans px-4 py-2 rounded-[8px] transition-colors shadow-sm-3"
          >
            Book Visit
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
