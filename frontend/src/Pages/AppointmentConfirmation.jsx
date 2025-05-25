import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// Load Square SDK
const loadSquareSdk = () => {
  return new Promise((resolve) => {
    if (window.Square) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://web.squarecdn.com/v1/square.js';
    script.onload = () => resolve();
    script.onerror = () => console.error('Failed to load Square SDK');
    document.body.appendChild(script);
  });
};

// Square Payment Component (Direct Frontend Processing)
const SquarePayment = ({ 
  applicationId, 
  locationId, 
  amount, 
  onPaymentSuccess, 
  disabled 
}) => {
  const [card, setCard] = useState(null);

  useEffect(() => {
    if (!window.Square) return;

    const initializePayment = async () => {
      try {
        const payments = window.Square.payments(applicationId, locationId);
        const card = await payments.card();
        await card.attach('#card-container');
        setCard(card);

        return () => {
          if (card) card.destroy();
        };
      } catch (error) {
        console.error('Square payment initialization error:', error);
      }
    };

    initializePayment();
  }, [applicationId, locationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!card || disabled) return;

    try {
      const tokenResult = await card.tokenize();
      if (tokenResult.status === 'OK') {
        // Simulate a successful payment (since we're not using a backend)
        console.log('Payment token:', tokenResult.token);
        onPaymentSuccess();
      } else {
        throw new Error(tokenResult.errors?.join(', ') || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentSuccess(error.message || 'Payment failed. Please try again.');
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div id="card-container" className="mb-4"></div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
        disabled={disabled || !card}
      >
        Pay ${amount}
      </button>
    </form>
  );
};

export default function AppointmentConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [squareLoaded, setSquareLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    loadSquareSdk()
      .then(() => setSquareLoaded(true))
      .catch(error => {
        console.error('Square SDK loading error:', error);
        setPaymentError('Failed to load payment system. Please refresh the page.');
      });

    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handlePaymentSuccess = () => {
    setPaymentProcessing(false);
    alert('Payment successful! Your appointment is confirmed.');
    navigate('/dashboard/appointments', { state: { paymentSuccess: true } });
  };

  const handlePaymentError = (error) => {
    setPaymentProcessing(false);
    setPaymentError(error);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!state) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <Alert severity="error" className="mb-4">
          No appointment data found. Please try booking again.
        </Alert>
        <button
          onClick={() => navigate('/doctors')}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  const { doctor, date, time, appointmentData } = state;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <div className="text-center mb-6">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-green-600">Appointment Confirmed!</h2>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3 text-lg">Appointment Details</h3>
        <div className="space-y-2">
          <p className="flex justify-between">
            <span className="font-medium">Doctor:</span>
            <span>{doctor.name || 'N/A'}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Specialty:</span>
            <span>{doctor.specialization || doctor.specialty || 'N/A'}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Date:</span>
            <span>{new Date(date).toLocaleDateString()}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Time:</span>
            <span>{time}</span>
          </p>
          {doctor.consultationFee && (
            <p className="flex justify-between">
              <span className="font-medium">Consultation Fee:</span>
              <span className="text-green-600 font-semibold">${doctor.consultationFee}</span>
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        {squareLoaded ? (
          <div>
            <SquarePayment
              applicationId="sandbox-sq0idb-zuMfAm5tVwEk7GF0JBLFFw" // Replace with your actual ID
              locationId="LY3JM5C4XTMFP" // Replace with your actual ID
              amount={doctor.consultationFee}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              disabled={paymentProcessing}
            />
            {paymentProcessing && (
              <div className="mt-2 text-center">
                <CircularProgress size={24} />
                <p className="text-sm text-gray-600">Processing payment...</p>
              </div>
            )}
            {paymentError && (
              <Alert severity="error" className="mt-2">
                {paymentError}
              </Alert>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <CircularProgress />
            <p className="mt-2 text-gray-600">Loading payment system...</p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to cancel this appointment?')) {
              alert('Appointment cancelled');
              navigate('/doctors');
            }
          }}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
          disabled={paymentProcessing}
        >
          Cancel Appointment
        </button>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}