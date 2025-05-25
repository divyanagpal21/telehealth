
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