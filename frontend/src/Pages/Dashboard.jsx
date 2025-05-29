// src/Pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import AppointmentCard from '../components/AppointmentCard';
import DoctorCard from '../components/DoctorCard';
import Tabs from '../components/Tabs';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('appointments') || '[]');
    setAppointments(stored);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Header name="Ash" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Left - Upcoming Consultations */}
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Upcoming Consultations</h2>
            {appointments.length > 0 ? (
              appointments.map((appt, index) => (
                <AppointmentCard
                  key={index}
                  date={appt.date}
                  time={appt.time}
                  duration={appt.duration}
                  doctor={appt.doctor}
                  specialty={appt.specialty}
                  color={appt.color}
                  initials={appt.initials}
                />
              ))
            ) : (
              <p>No appointments found.</p>
            )}
          </section>
          <button className="text-blue-600 font-medium underline">View All Appointments</button>
        </div>

        {/* Right - Doctor list */}
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Find a Doctor</h2>
            <DoctorCard initials="EJ" name="Dr. Emma Johnson" specialty="General Medicine" color="bg-pink-600" />
            <DoctorCard initials="RC" name="Dr. Robert Chen" specialty="Cardiology" color="bg-lime-500" />
            <DoctorCard initials="SP" name="Dr. Sophia Patel" specialty="Pediatrics" color="bg-yellow-400" />
          </section>
        </div>
      </div>

      <Tabs />
    </div>
  );
}
