// src/Pages/AppointmentConfirmation.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AppointmentConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { doctor, date, time } = state || {};

  useEffect(() => {
    if (doctor && date && time) {
      const existing = JSON.parse(localStorage.getItem('appointments') || '[]');
      const newAppointment = {
        doctor: doctor.name,
        specialty: doctor.specialty,
        date,
        time,
        duration: '30 min',
        initials: doctor.name
          .split(' ')
          .map(word => word[0])
          .join(''),
        color: 'bg-blue-500'
      };
      localStorage.setItem('appointments', JSON.stringify([...existing, newAppointment]));
    }
  }, [doctor, date, time]);

  if (!doctor || !date || !time) {
    return (
      <div className="p-6 text-red-600 max-w-xl mx-auto">
        Invalid appointment data.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Appointment Confirmed</h2>

      <p className="mb-2">
        <strong>Doctor:</strong> {doctor.name}
      </p>
      <p className="mb-2">
        <strong>Specialty:</strong> {doctor.specialty}
      </p>
      <p className="mb-2">
        <strong>Date:</strong> {date}
      </p>
      <p className="mb-4">
        <strong>Time:</strong> {time}
      </p>

      <div className="flex justify-center gap-4">
        <button
          className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
          onClick={() => (alert('Booking Done'),navigate('/dashboard'))}
        >
          Pay Online
        </button>

        <button
          className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700"
          onClick={() => navigate('/doctors')}
        >
          Cancel Appointment
        </button>
      </div>
    </div>
  );
}
