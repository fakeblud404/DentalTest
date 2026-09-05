import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Button from '../components/Button'

interface Appointment {
  id: number
  service: string
  dentist: string
  appointment_date: string
  appointment_time: string
  status: string
  created_at: string
  patient_name: string
  phone: string
  email: string
  is_new_patient: boolean
}

const AdminAppointments: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('admin_authenticated') === 'true'
  })
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [loginError, setLoginError] = useState('')

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showGantt, setShowGantt] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments()
    }
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (usernameInput === 'KathmanduDental' && passwordInput === 'admin123') {
      setIsAuthenticated(true)
      localStorage.setItem('admin_authenticated', 'true')
      setLoginError('')
    } else {
      setLoginError('Invalid admin username or password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
  }

  const fetchAppointments = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/appointments')
      if (!response.ok) {
        throw new Error('Failed to fetch appointments')
      }
      const data = await response.json()
      // Sort oldest to newest (1 being oldest)
      const sorted = (data.appointments || []).sort(
        (a: Appointment, b: Appointment) => a.id - b.id
      )
      setAppointments(sorted)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // Export appointments to Excel (CSV format with BOM for Excel compatibility)
  const exportToExcel = () => {
    if (appointments.length === 0) return

    const headers = [
      'ID',
      'Patient Name',
      'Phone',
      'Email',
      'New Patient',
      'Service',
      'Dentist',
      'Appointment Date',
      'Appointment Time',
      'Status',
      'Booked At',
    ]

    const rows = appointments.map((appt) => [
      appt.id,
      `"${(appt.patient_name || '').replace(/"/g, '""')}"`,
      `"${appt.phone || ''}"`,
      `"${appt.email || ''}"`,
      appt.is_new_patient ? 'Yes' : 'No',
      `"${(appt.service || '').replace(/"/g, '""')}"`,
      `"${(appt.dentist || '').replace(/"/g, '""')}"`,
      appt.appointment_date,
      appt.appointment_time,
      appt.status,
      new Date(appt.created_at).toLocaleString(),
    ])

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `kathmandu_dental_appointments_${new Date().toISOString().split('T')[0]}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter today's appointments for Gantt view
  const todaysAppointments = appointments.filter((appt) => {
    const apptDateStr = new Date(appt.appointment_date)
      .toISOString()
      .split('T')[0]
    return apptDateStr === selectedDate
  })

  // Time slots for Gantt Chart (8:00 AM to 6:00 PM)
  const timeSlots = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
  ]

  // Unique dentists list
  const dentists = Array.from(new Set(appointments.map((a) => a.dentist)))

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cloud font-sans text-ink-navy flex items-center justify-center p-4">
        <div className="bg-paper p-8 md:p-10 rounded-[20px] border border-hairline shadow-sm-2 text-center max-w-md w-full">
          <div className="w-12 h-12 rounded-full bg-signal-blue/10 text-signal-blue flex items-center justify-center text-2xl mx-auto mb-4">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-ink-navy mb-1">Admin Login</h2>
          <p className="text-sm text-slate-gray mb-6">Kathmandu Dental Care Management Portal</p>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[8px] text-xs font-semibold text-red-700">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-gray mb-1">
                Username
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter admin username"
                required
                className="w-full px-4 py-2.5 rounded-[8px] border border-hairline bg-paper text-sm text-ink-navy font-semibold focus:outline-none focus:border-signal-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-gray mb-1">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-4 py-2.5 rounded-[8px] border border-hairline bg-paper text-sm text-ink-navy font-semibold focus:outline-none focus:border-signal-blue"
              />
            </div>

            <Button variant="primary" size="lg" className="w-full mt-2">
              Sign In to Dashboard
            </Button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-hairline text-center">
            <Link to="/" className="text-xs font-semibold text-signal-blue hover:underline">
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading)
    return (
      <div className="min-h-screen bg-cloud font-sans text-ink-navy p-10 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-signal-blue border-t-transparent animate-spin mx-auto"></div>
          <p className="text-slate-gray font-medium">Loading appointments...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-cloud font-sans text-ink-navy p-10 flex items-center justify-center">
        <div className="bg-paper p-8 rounded-[16px] border border-hairline shadow-sm-2 text-center max-w-md">
          <span className="text-3xl mb-3 block">⚠️</span>
          <h3 className="text-xl font-bold text-ink-navy mb-2">Error Loading Appointments</h3>
          <p className="text-slate-gray mb-6 text-sm">{error}</p>
          <Button variant="primary" onClick={fetchAppointments}>
            Retry Loading
          </Button>
        </div>
      </div>
    )

  return (
    <div className="bg-cloud min-h-screen font-sans text-ink-navy pb-20">
      <Nav />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Top Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-hairline">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-ink-navy">Appointment Register</h1>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1 rounded-[6px] transition-all"
              >
                Log Out
              </button>
            </div>   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[50px] bg-[#e6f0ff] text-deep-cobalt text-[12px] font-semibold mb-2">
              <span>ADMINISTRATIVE PANEL</span>
            </div>
            <h1 className="text-[38px] font-bold text-ink-navy tracking-tight">
              Appointments Directory
            </h1>
            <p className="text-[14px] text-slate-gray">
              Sorted oldest to newest (1 to {appointments.length}). Total appointments: {appointments.length}
            </p>
          </div>

          {/* Buttons: Download Excel & Gantt Chart View */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 bg-paper border border-hairline hover:border-signal-blue hover:bg-pebble text-ink-navy text-[14px] font-semibold px-4 py-2.5 rounded-[8px] transition-all shadow-sm-3"
            >
              <svg
                className="w-4 h-4 text-signal-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Download Excel (.csv)</span>
            </button>

            <button
              onClick={() => setShowGantt(!showGantt)}
              className={`inline-flex items-center gap-2 text-[14px] font-semibold px-4 py-2.5 rounded-[8px] transition-all shadow-sm-3 ${
                showGantt
                  ? 'bg-ink-navy text-paper'
                  : 'bg-signal-blue text-paper hover:bg-[#0056cc]'
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{showGantt ? 'Hide Today Gantt View' : 'Today Gantt View'}</span>
            </button>
          </div>
        </div>

        {/* TODAY GANTT CHART VIEW MODAL / SECTION */}
        {showGantt && (
          <div className="mb-10 bg-paper rounded-[16px] border border-hairline p-6 shadow-sm-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
              <div>
                <h3 className="text-[20px] font-bold text-ink-navy flex items-center gap-2">
                  <span className="text-signal-blue">📊</span> Today's Appointment Schedule (Gantt View)
                </h3>
                <p className="text-[13px] text-slate-gray">
                  Visual timeline view of scheduled appointments by dentist & time slot.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[13px] font-semibold text-slate-gray">Select Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-pebble border border-hairline rounded-[8px] px-3 py-1.5 text-[13px] font-medium text-ink-navy focus:outline-none focus:border-signal-blue"
                />
              </div>
            </div>

            {todaysAppointments.length === 0 ? (
              <div className="py-8 text-center bg-pebble/40 rounded-[12px] border border-dashed border-hairline">
                <p className="text-slate-gray text-[14px]">No appointments scheduled for {selectedDate}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Timeline Header */}
                  <div className="grid grid-cols-12 gap-1 bg-pebble p-3 rounded-[8px] font-semibold text-[12px] text-slate-gray text-center mb-4">
                    <div className="col-span-2 text-left pl-2">Dentist / Time</div>
                    {timeSlots.slice(0, 10).map((slot, idx) => (
                      <div key={idx} className="col-span-1 border-l border-hairline pl-1">
                        {slot.split(' ')[0]}
                      </div>
                    ))}
                  </div>

                  {/* Dentist Rows */}
                  {dentists.map((dentist, dIdx) => {
                    const dentistAppts = todaysAppointments.filter((a) => a.dentist === dentist)

                    return (
                      <div key={dIdx} className="grid grid-cols-12 gap-1 items-center border-b border-hairline py-4">
                        <div className="col-span-2 pl-2">
                          <div className="font-bold text-[14px] text-ink-navy">Dr. {dentist}</div>
                          <div className="text-[11px] text-slate-gray">{dentistAppts.length} appts today</div>
                        </div>

                        {/* Schedule Timeline */}
                        <div className="col-span-10 grid grid-cols-10 gap-1 bg-cloud p-2 rounded-[8px] relative min-h-[50px] items-center">
                          {dentistAppts.map((appt) => {
                            // Extract hour for positioning (e.g. "09:00 AM" -> 9)
                            const timeStr = appt.appointment_time || ''
                            let hour = parseInt(timeStr.split(':')[0]) || 9
                            if (timeStr.toLowerCase().includes('pm') && hour !== 12) hour += 12
                            if (timeStr.toLowerCase().includes('am') && hour === 12) hour = 0

                            // Map 8am-5pm to 0-9 index
                            const colStart = Math.max(0, Math.min(9, hour - 8))

                            return (
                              <div
                                key={appt.id}
                                style={{ gridColumnStart: colStart + 1, gridColumnEnd: `span 2` }}
                                className="bg-signal-blue text-paper p-2 rounded-[8px] shadow-sm text-[12px] font-medium truncate group relative hover:z-20 cursor-pointer"
                              >
                                <div className="font-semibold truncate">#{appt.id} - {appt.patient_name}</div>
                                <div className="text-[10px] opacity-90 truncate">{appt.service} ({appt.appointment_time})</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* APPOINTMENTS TABLE - SORTED OLDEST TO NEWEST (1 to N) */}
        <div className="bg-paper rounded-[16px] border border-hairline shadow-sm-2 overflow-hidden">
          {appointments.length === 0 ? (
            <div className="p-12 text-center text-slate-gray">
              <p className="text-[16px]">No appointments booked yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-hairline">
                <thead className="bg-pebble/60">
                  <tr>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-slate-gray uppercase tracking-wider">
                      # (Oldest → Newest)
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-slate-gray uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-slate-gray uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-slate-gray uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-slate-gray uppercase tracking-wider">
                      Dentist
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-slate-gray uppercase tracking-wider">
                      Appt Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-slate-gray uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-slate-gray uppercase tracking-wider">
                      Booked At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-paper divide-y divide-hairline">
                  {appointments.map((appt, idx) => (
                    <tr key={appt.id} className="hover:bg-pebble/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-signal-blue">
                        {idx + 1}
                        <span className="text-[11px] text-slate-gray font-normal ml-1">(ID: {appt.id})</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[14px] font-semibold text-ink-navy">
                          {appt.patient_name || 'N/A'}
                        </div>
                        {appt.is_new_patient && (
                          <span className="inline-block mt-0.5 text-[10px] bg-[#e6f0ff] text-deep-cobalt px-2 py-0.5 rounded-[4px] font-medium">
                            New Patient
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[13px] text-slate-gray">
                        <div>{appt.phone || 'N/A'}</div>
                        <div className="text-[11px] text-slate-gray/80">{appt.email || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-ink-navy capitalize">
                        {appt.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[14px] text-ink-navy">
                        Dr. {appt.dentist}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[13px] text-ink-navy">
                        <div className="font-semibold">{new Date(appt.appointment_date).toLocaleDateString()}</div>
                        <div className="text-slate-gray text-[12px]">{appt.appointment_time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-[12px] leading-5 font-semibold rounded-[50px] ${
                            appt.status === 'scheduled'
                              ? 'bg-[#e6f0ff] text-deep-cobalt'
                              : appt.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : appt.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-pebble text-slate-gray'
                          }`}
                        >
                          {appt.status ? appt.status.charAt(0).toUpperCase() + appt.status.slice(1) : 'Scheduled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[12px] text-slate-gray">
                        {new Date(appt.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminAppointments