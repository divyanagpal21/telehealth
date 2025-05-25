

import  { useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";


 const MainContent = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-green-50 p-6 rounded-lg m-4 shadow-md flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-lg">
          <h2 className="text-2xl font-bold mb-2">Virtual Healthcare at Your Fingertips</h2>
          <p className="text-gray-700">
            Connect with healthcare professionals from the comfort of your home. Secure,
            accessible, and convenient telehealth consultations.
          </p>
        </div>
        <img
          src="/images/group_profiles.png"
          alt="Doctors"
          className="mt-4 md:mt-0 md:ml-4 w-48"
        />
      </section>

      {/* Speciality Section */}
      <section className="bg-green-100 py-8 px-4 text-center">
        <h3 className="text-xl font-semibold mb-2">Find by Speciality</h3>
        <p className="mb-4">
          simply browse through our extensive list of trusted doctors
        </p>
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          {[
            { icon: "Neurologist.svg", label: "Neurologist" },
            { icon: "General_physician.svg", label: "General physician" },
            { icon: "Gynecologist.svg", label: "Gynecologist" },
            { icon: "Pediatricians.svg", label: "Pediatrician" },
            { icon: "Gastroenterologist.svg", label: "Gastroenterologist" },
            { icon: "Dermatologist.svg", label: "Dermatologist" },
          ].map(({ icon, label }, i) => (
            <div key={i} className="flex flex-col items-center">
              <img
                src={`/images/${icon}`}
                alt={label}
                className="w-16 h-16 rounded-full mb-2"
              />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
        <p className="text-sm">
          simply browse through our extensive list of trusted doctors, schedule your
          appointment
        </p>
      </section>

      {/* Top Doctors Section */}
      <section className="py-8 px-4 text-center">
        <h3 className="text-xl font-semibold mb-1">Top Doctors to Book</h3>
        <p className="mb-6">Extensive list of trusted doctors</p>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { name: "Dr.james", title: "General physician", image: "Dr.james.png" },
            { name: "Dr.Emily potter", title: "Neurologist", image: "Dr.emily potter.png" },
            { name: "Dr.Sarah patel", title: "Dermatologist", image: "Dr.sarah patel.png" },
          ].map((doc, i) => (
            <div key={i} className="text-center">
              <img
                src={`/images/${doc.image}`}
                alt={doc.name}
                className="mx-auto rounded-full mb-2 w-24 h-24 object-cover"
              />
              <div className="font-semibold">{doc.name}</div>
              <div className="text-sm text-gray-600">{doc.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-200 py-8 px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 flex items-center gap-4">
          <img
            src="/images/appointment_img.png"
            alt="Appointment"
            className="w-16 h-16"
          />
          <h3 className="text-xl font-bold">
            Book Appointment With 100+ trusted Doctors
          </h3>
        </div>
      </section>
    </>
  );
};

export default MainContent