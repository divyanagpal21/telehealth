// src/components/DoctorProfile.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorsData } from '../data/doctors';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const doctor = doctorsData.find((doc) => doc.id === id);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  if (!doctor) {
    return (
      <div className="p-6 text-red-600">
        Doctor not found
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
      <p className="mb-1"><strong>Specialty:</strong> {doctor.specialty}</p>
      <p className="mb-1"><strong>Qualification:</strong> {doctor.qualification}</p>
      <p className="mb-1"><strong>Experience:</strong> {doctor.experience}</p>
      <p className="mb-4">{doctor.about}</p>
      <p className="mb-4 font-semibold">Consultation Fee: ${doctor.fee}</p>

      <h2 className="text-xl font-semibold mb-2">Select Date</h2>
      <div className="flex gap-2 flex-wrap mb-4">
        {doctor.availability.dates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`px-4 py-2 rounded border ${
              selectedDate === date ? 'bg-violet-700 text-white' : 'bg-gray-100 hover:bg-violet-200'
            }`}
          >
            {date}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">Select Time</h2>
      <div className="flex gap-2 flex-wrap mb-6">
        {doctor.availability.times.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`px-4 py-2 rounded border ${
              selectedTime === time ? 'bg-violet-700 text-white' : 'bg-gray-100 hover:bg-violet-200'
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <button
        disabled={!selectedDate || !selectedTime}
        onClick={() =>
          navigate('/appointment-confirmation', {
            state: { doctor, date: selectedDate, time: selectedTime },
          })
        }
        className={`w-full py-3 rounded text-white font-semibold transition ${
          selectedDate && selectedTime
            ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Book Appointment
      </button>
    </div>
  );
}
