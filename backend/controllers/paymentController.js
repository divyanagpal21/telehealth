const { Client, Environment } = require('square');

// Setup Square client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
});

const paymentsApi = squareClient.paymentsApi;

// Payment handler
const processPayment = async (req, res) => {
  const { token, amount } = req.body;

  try {
    const response = await paymentsApi.createPayment({
      sourceId: token,
      idempotencyKey: new Date().getTime().toString(),
      amountMoney: {
        amount: amount,
        currency: 'USD',
      },
    });

    res.status(200).json({ success: true, data: response.result });
  } catch (error) {
    console.error('❌ Payment Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { processPayment };
