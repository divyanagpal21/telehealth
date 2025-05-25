import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { doctorsData } from '../data/doctors';
   // Adjust path as necessary

const specialities = [
  "All",
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatrician",
  "Neurologist",
  "Gastroenterologist"
];

export default function AllDoctors() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const filteredDoctors = selectedSpecialty === "All"
    ? doctorsData
    : doctorsData.filter(doc => doc.specialty === selectedSpecialty);

  return (
    <div className="p-6 md:p-12">
      <h2 className="text-xl font-semibold mb-6">Browse through the doctors by specialty</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="md:w-1/5">
          <div className="flex flex-col gap-2">
            {specialities.map((spec, i) => (
              <button
                key={i}
                onClick={() => setSelectedSpecialty(spec)}
                className={`border px-4 py-2 rounded text-left hover:bg-violet-100 ${
                  selectedSpecialty === spec ? 'bg-violet-200 font-semibold' : ''
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1">
          {filteredDoctors.map((doc) => (
            <Link to={`/doctors/${doc.id}`} key={doc.id}>
              <div className="rounded-lg shadow p-4 bg-white hover:shadow-lg transition">
                <img
                  src={`/images/${doc.image}`} // Ensure these images exist in /public/images/
                  alt={doc.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <div className="text-green-600 text-sm mb-1">🟢 Available</div>
                <h3 className="font-semibold">{doc.name}</h3>
                <p className="text-sm text-gray-600">{doc.specialty}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
