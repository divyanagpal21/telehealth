import React, { useEffect } from 'react';
import axios from 'axios';

const SquarePayment = () => {
  useEffect(() => {
    const loadSquare = async () => {
      if (!window.Square) {
        console.error('Square SDK failed to load');
        return;
      }

      const payments = window.Square.payments(
        import.meta.env.VITE_SQUARE_APPLICATION_ID,
        import.meta.env.VITE_SQUARE_LOCATION_ID

      );

      const card = await payments.card();
      await card.attach('#card-container');

      document.getElementById('pay-btn').addEventListener('click', async () => {
        const result = await card.tokenize();
        if (result.status === 'OK') {
          const token = result.token;
          const res = await axios.post('/api/payment', {
            token,
            amount: 1000, // Amount in cents ($10.00)
          });

          if (res.data.success) {
            alert('Payment Successful!');
          } else {
            alert('Payment Failed!');
          }
        } else {
          alert('Tokenization failed');
        }
      });
    };

    loadSquare();
  }, []);

  return (
    <div>
      <div id="card-container" style={{ marginBottom: '16px' }}></div>
      <button id="pay-btn">Pay $10</button>
    </div>
  );
};

export default SquarePayment;
