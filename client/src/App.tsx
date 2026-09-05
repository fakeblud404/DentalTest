import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import About from './pages/About'
import NewPatients from './pages/NewPatients'
import Booking from './pages/Booking'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import AdminAppointments from './pages/AdminAppointments'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceId" element={<ServiceDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/new-patients" element={<NewPatients />} />
        <Route path="/booking" element={<Booking />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminAppointments />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App