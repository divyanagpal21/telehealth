const { SquareClient, SquareEnvironment, SquareError } = require("square")
require('dotenv').config()

// Initialize Square client
const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox,
});

/**
 * Process payment using Square API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const processPayment = async (req, res) => {
  const { token, amount, appointmentId, doctorId } = req.body;

  // Validate required fields
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Payment token is required',
    });
  }

  if (!amount || isNaN(amount)) {
    return res.status(400).json({
      success: false,
      message: 'Valid payment amount is required',
    });
  }

  try {
    const amountInCents = Math.round(parseFloat(amount) * 100); // Convert dollars to cents

    // Create payment with Square API
    const paymentsApi = client.paymentsApi;
    const requestBody = {
      sourceId: token,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: BigInt(amountInCents), // Square expects BigInt for amount
        currency: 'USD',
      },
    };

    // Add optional fields if available
    if (appointmentId) {
      requestBody.note = `Appointment ID: ${appointmentId}`;
    }

    if (req.user?.email) {
      requestBody.buyerEmailAddress = req.user.email;
    }

    const response = await paymentsApi.createPayment(requestBody);

    // Log successful payment (in production, you'd save to database)
    console.log('✅ Payment processed:', {
      paymentId: response.result.payment.id,
      amount: Number(response.result.payment.amountMoney.amount) / 100,
      status: response.result.payment.status,
      appointmentId,
    });

    // Return success response
    return res.status(200).json({
      success: true,
      payment: {
        id: response.result.payment.id,
        amount: Number(response.result.payment.amountMoney.amount) / 100,
        currency: response.result.payment.amountMoney.currency,
        status: response.result.payment.status,
        receiptUrl: response.result.payment.receiptUrl,
        createdAt: response.result.payment.createdAt,
      },
      appointmentId,
    });

  } catch (error) {
    console.error('❌ Payment Error:', error);

    // Extract error details from Square response
    let errorMessage = 'Payment processing failed';
    let errorDetails = null;

    if (error.result && error.result.errors && Array.isArray(error.result.errors)) {
      errorDetails = error.result.errors.map(err => ({
        code: err.code,
        detail: err.detail,
        field: err.field,
      }));
      errorMessage = error.result.errors.map(err => err.detail).join('; ');
    } else if (error.errors && Array.isArray(error.errors)) {
      errorDetails = error.errors.map(err => ({
        code: err.code,
        detail: err.detail,
        field: err.field,
      }));
      errorMessage = error.errors.map(err => err.detail).join('; ');
    } else if (error.message) {
      errorMessage = error.message;
    }

    return res.status(500).json({
      success: false,
      message: errorMessage,
      details: errorDetails,
    });
  }
};


module.exports = {processPayment}