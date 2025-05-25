import React, { useEffect } from 'react';
import axios from 'axios';

const SquarePayment = () => {
  useEffect(() => {
    const loadSquare = async () => {
      if (!window.Square) {
        console.error('Square SDK failed to load');
        return;
      }

      // Hardcoded sandbox keys (for local dev only — REMOVE BEFORE PUSHING TO GITHUB)
      const payments = window.Square.payments(
        'sandbox-sq0idb-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',  // your test App ID
        'LXXXXXXXXXXXX'                                  // your test Location ID
      );
      // jb tu env file dalegi na toh isse hata diyo ye testing ke liye h bss

      const card = await payments.card();
      await card.attach('#card-container');

      document.getElementById('pay-btn').addEventListener('click', async () => {
        const result = await card.tokenize();
        if (result.status === 'OK') {
          const token = result.token;
          try {
            const res = await axios.post('http://localhost:5000/api/payment', {
              token,
              amount: 1000, // $10.00 in cents
            });

            if (res.data.success) {
              alert('✅ Payment Successful!');
            } else {
              alert('❌ Payment Failed');
            }
          } catch (error) {
            alert('❌ Server error: ' + error.message);
          }
        } else {
          alert('❌ Tokenization failed');
        }
      });
    };

    loadSquare();
  }, []);

  return (
    <div>
      <h2>Complete Your Payment</h2>
      <div id="card-container" style={{ marginBottom: '16px' }}></div>
      <button id="pay-btn">Pay $10</button>
    </div>
  );
};

export default SquarePayment;
