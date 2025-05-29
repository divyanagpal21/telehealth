import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Available doctor images (same as AllDoctors component)
  const availableImages = [
    '/images/doc2.png',
    '/images/doc3.png',
    '/images/doc6.png',
    '/images/doc7.png',
    '/images/doc8.png',
    '/images/doc10.png',
    '/images/doc12.png'
  ];

  // Generate sample availability data
  const generateAvailability = () => {
    const dates = [];
    const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

    // Generate next 7 days
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }));
    }

    return { dates, times };
  };

  useEffect(() => {
    const fetchDoctorDetails = async () => {
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
          throw new Error('Failed to fetch doctor details');
        }

        const data = await response.json();
        const foundDoctor = data.data.doctors.find(doc => doc.id === id);

        if (!foundDoctor) {
          throw new Error('Doctor not found');
        }

        // Assign random image if none exists
        if (!foundDoctor.profileImage) {
          const randomIndex = Math.floor(Math.random() * availableImages.length);
          foundDoctor.profileImage = availableImages[randomIndex];
        }

        // Add availability data (since it might not come from API)
        foundDoctor.availability = generateAvailability();

        setDoctor(foundDoctor);
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

    if (id) {
      fetchDoctorDetails();
    }
  }, [id]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Updated handleBookAppointment function for DoctorProfile.jsx
  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      setSnackbar({
        open: true,
        message: 'Please select both date and time',
        severity: 'warning'
      });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:5000/api/v1/patient/book', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jwt: token,
          doctorId: doctor.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to book appointment');
      }

      const data = await response.json();

      setSnackbar({
        open: true,
        message: 'Appointment booked successfully!',
        severity: 'success'
      });

      // Create comprehensive state object to pass
      const appointmentState = {
        doctor: {
          id: doctor.id,
          name: doctor.name,
          specialization: doctor.specialization,
          specialty: doctor.specialization, // Fallback for compatibility
          consultationFee: doctor.consultationFee,
          profileImage: doctor.profileImage
        },
        date: selectedDate,
        time: selectedTime,
        appointmentData: data.data || data, // Handle different response structures
        bookingSuccess: true,
        timestamp: new Date().toISOString() // Add timestamp for debugging
      };

      console.log('Navigating with state:', appointmentState); // Debug log

      // Navigate immediately without delay to prevent state loss
      navigate('/appointment-confirmation', {
        state: appointmentState,
        replace: false // Ensure it's added to history
      });

    } catch (err) {
      console.error('Booking error:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to book appointment',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert severity="error" className="mb-4">
          {error || 'Doctor not found'}
        </Alert>
        <button
          onClick={() => navigate('/doctors')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      {/* Doctor Header with Image */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="md:w-1/3">
          <img
            src={doctor.profileImage}
            alt={doctor.name || "Doctor"}
            className="w-full h-64 object-cover rounded-lg shadow"
            onError={(e) => {
              const fallbackIndex = Math.floor(Math.random() * availableImages.length);
              e.target.src = availableImages[fallbackIndex];
            }}
          />
        </div>

        <div className="md:w-2/3">
          <div className={`inline-block px-3 py-1 rounded-full text-sm mb-2 ${doctor.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            {doctor.isAvailable ? '🟢 Available' : '🔴 Not Available'}
          </div>

          <h1 className="text-3xl font-bold mb-2">{doctor.name || "Dr. Unknown"}</h1>
          <p className="mb-1"><strong>Specialty:</strong> {doctor.specialization || "General Practice"}</p>
          {doctor.qualification && (
            <p className="mb-1"><strong>Qualification:</strong> {doctor.qualification}</p>
          )}
          {doctor.experience > 0 && (
            <p className="mb-1"><strong>Experience:</strong> {doctor.experience} years</p>
          )}
          {doctor.about && (
            <p className="mb-4 text-gray-700">{doctor.about}</p>
          )}
          {doctor.consultationFee && (
            <p className="mb-4 font-semibold text-lg text-green-600">
              Consultation Fee: ${doctor.consultationFee}
            </p>
          )}
        </div>
      </div>

      {/* Appointment Booking Section */}
      {doctor.isAvailable ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Select Date</h2>
          <div className="flex gap-2 flex-wrap mb-4">
            {doctor.availability.dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 rounded border ${selectedDate === date ? 'bg-violet-700 text-white' : 'bg-gray-100 hover:bg-violet-200'
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
                className={`px-4 py-2 rounded border ${selectedTime === time ? 'bg-violet-700 text-white' : 'bg-gray-100 hover:bg-violet-200'
                  }`}
              >
                {time}
              </button>
            ))}
          </div>

          <button
            disabled={!selectedDate || !selectedTime}
            onClick={handleBookAppointment}
            className={`w-full py-3 rounded text-white font-semibold transition ${selectedDate && selectedTime
                ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed'
              }`}
          >
            Book Appointment
          </button>
        </>
      ) : (
        <div className="text-center py-8">
          <Alert severity="info">
            This doctor is currently not available for appointments.
          </Alert>
          <button
            onClick={() => navigate('/doctors')}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Browse Other Doctors
          </button>
        </div>
      )}

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