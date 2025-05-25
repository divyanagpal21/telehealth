const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const http = require('http');
require('dotenv').config();

const patientRoutes = require('./routes/patient');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const doctorRoutes = require('./routes/doctor');
// const paymentRoutes = require('./routes/paymentroutes');
const setupDeepgramServer = require('./deepgramSocket');
const setupSocketServer = require('./socket/chatSocket'); // New import

const app = express();
const server = http.createServer(app);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Middleware
app.use(limiter);
app.use(cors({
  origin: "http://localhost:3000", // Your frontend URL
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/doctor', doctorRoutes);
app.use('/api/v1/patient', patientRoutes);
// app.use('/api/payment', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Setup Socket.IO server

const io = setupSocketServer(server);

// Setup Deepgram WebSocket with Socket.IO integration
setupDeepgramServer(io);              // ✅ No longer passes `server`

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});