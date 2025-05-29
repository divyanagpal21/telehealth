import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

export default function AllDoctors() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Available doctor images in public/images
  const availableImages = [
    '/images/doc2.png',
    '/images/doc3.png',
    '/images/doc6.png',
    '/images/doc7.png',
    '/images/doc8.png',
    '/images/doc10.png',
    '/images/doc12.png'
  ];

  // Function to randomly assign images to doctors
  const assignRandomImages = (doctorsData) => {
    return doctorsData.map(doctor => {
      // If doctor already has a profileImage, keep it, otherwise assign random one
      if (!doctor.profileImage) {
        const randomIndex = Math.floor(Math.random() * availableImages.length);
        return {
          ...doctor,
          profileImage: availableImages[randomIndex]
        };
      }
      return doctor;
    });
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch('http://localhost:5000/api/v1/patient/getDoctors', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const data = await response.json();
        // Assign random images to doctors without profile images
        const doctorsWithImages = assignRandomImages(data.data.doctors);
        setDoctors(doctorsWithImages);
      } catch (err) {
        setError(err.message);
        setSnackbar({
          open: true,
          message: err.message,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Extract unique specializations from doctors data
  const specialities = ["All", ...new Set(doctors.map(doc => doc.specialization))].filter(Boolean);

  const filteredDoctors = selectedSpecialty === "All"
    ? doctors
    : doctors.filter(doc => doc.specialization === selectedSpecialty);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-12">
        <Alert severity="error" className="mb-6">
          {error} - Please try again later or contact support.
        </Alert>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

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
                {spec || "Unknown Specialty"}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1">
            {filteredDoctors.map((doc) => (
              <Link to={`/doctors/${doc.id}`} key={doc.id} className="hover:no-underline">
                <div className="rounded-lg shadow p-4 bg-white hover:shadow-lg transition h-full flex flex-col">
                  <div className="flex justify-center mb-4 bg-gray-100 rounded">
                    <img
                      src={doc.profileImage}
                      alt={doc.name || "Doctor"}
                      className="w-full h-48 object-cover rounded"
                      onError={(e) => {
                        // Fallback to a different random image if the current one fails
                        const fallbackIndex = Math.floor(Math.random() * availableImages.length);
                        e.target.src = availableImages[fallbackIndex];
                      }}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className={`text-sm mb-1 ${
                      doc.isAvailable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {doc.isAvailable ? '🟢 Available' : '🔴 Not Available'}
                    </div>
                    <h3 className="font-semibold">{doc.name || "Dr. Unknown"}</h3>
                    <p className="text-sm text-gray-600">{doc.specialization || "General Practice"}</p>
                    {doc.qualification && (
                      <p className="text-xs text-gray-500 mt-1">{doc.qualification}</p>
                    )}
                    {doc.experience > 0 && (
                      <p className="text-xs text-gray-500 mt-1">{doc.experience} years experience</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Alert severity="info">
              No doctors found {selectedSpecialty !== "All" ? `for specialty: ${selectedSpecialty}` : ''}
            </Alert>
          </div>
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}