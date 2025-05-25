const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { auth, authorize } = require('../middleware/auth');
const DoctorPatient = require('../models/DoctorPatient');
const User = require('../models/User');
const { getDoctors } = require('../controllers/doctorController');

// Helper function to verify JWT token without middleware (for body token)
const verifyTokenFromBody = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

// POST /api/v1/patient/book
router.post('/book', async (req, res) => {
  try {
    const { doctorId, jwt: token } = req.body;
    
    // Input validation
    if (!doctorId) {
      return res.status(400).json({ 
        message: 'Doctor ID is required',
        code: 'MISSING_DOCTOR_ID'
      });
    }
    
    if (!token) {
      return res.status(400).json({ 
        message: 'JWT token is required',
        code: 'MISSING_JWT'
      });
    }

    // Validate doctorId format
    if (!doctorId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        message: 'Invalid doctor ID format',
        code: 'INVALID_DOCTOR_ID'
      });
    }

    // Verify JWT token and get patient user
    let patientUser;
    try {
      patientUser = await verifyTokenFromBody(token);
      
      if (!patientUser || patientUser.role !== 'patient') {
        return res.status(403).json({ 
          message: 'Invalid token or user not authorized as patient',
          code: 'INVALID_USER'
        });
      }
    } catch (tokenError) {
      if (tokenError.name === 'JsonWebTokenError') {
        return res.status(403).json({ 
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        });
      }
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(403).json({ 
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      return res.status(500).json({ 
        message: 'Token verification failed',
        code: 'TOKEN_VERIFICATION_ERROR'
      });
    }

    // Check if doctor exists and has doctor role
    const doctor = await User.findById(doctorId).select('-password');
    
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ 
        message: 'Doctor not found or not available',
        code: 'DOCTOR_NOT_AVAILABLE'
      });
    }

    // Check if there's already an active doctor-patient relationship
    const existingRelationship = await DoctorPatient.findOne({
      doctorId: doctorId,
      patientId: patientUser._id,
      isActive: true
    });

    if (existingRelationship) {
      return res.status(409).json({ 
        message: 'You already have an active appointment/relationship with this doctor',
        code: 'RELATIONSHIP_EXISTS',
        data: {
          relationshipId: existingRelationship._id,
          assignedDate: existingRelationship.assignedDate,
          notes: existingRelationship.notes
        }
      });
    }

    // Create new doctor-patient relationship (appointment booking)
    const newRelationship = new DoctorPatient({
      doctorId: doctorId,
      patientId: patientUser._id,
      assignedDate: new Date(),
      isActive: true,
      notes: `Appointment booked by patient ${patientUser.firstName} ${patientUser.lastName} on ${new Date().toISOString()}`
    });

    const savedRelationship = await newRelationship.save();

    // Populate doctor and patient details for response
    const populatedRelationship = await DoctorPatient.findById(savedRelationship._id)
      .populate('doctorId', 'firstName lastName email specialization')
      .populate('patientId', 'firstName lastName email');

    // Return success response
    res.status(201).json({
      message: 'Appointment booked successfully',
      data: {
        appointmentId: savedRelationship._id,
        doctorId: doctorId,
        patientId: patientUser._id,
        doctor: {
          name: `${doctor.firstName} ${doctor.lastName}`,
          email: doctor.email,
          specialization: doctor.specialization || 'General Practice'
        },
        patient: {
          name: `${patientUser.firstName} ${patientUser.lastName}`,
          email: patientUser.email
        },
        assignedDate: savedRelationship.assignedDate,
        status: 'inactive',
        notes: savedRelationship.notes
      }
    });

  } catch (error) {
    console.error('Booking error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid ID format',
        code: 'INVALID_ID_FORMAT'
      });
    }

    // Handle duplicate key error (should not happen due to pre-check, but just in case)
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'Appointment already exists',
        code: 'DUPLICATE_APPOINTMENT'
      });
    }

    res.status(500).json({ 
      message: 'Failed to book appointment',
      code: 'BOOKING_FAILED'
    });
  }
});
// GET /api/v1/patient/getDoctors
router.get('/getDoctors', auth, authorize('patient'), getDoctors);

// GET /api/v1/patient/appointments - Get patient's appointments (using header auth)
router.get('/appointments', auth, authorize('patient'), async (req, res) => {
  try {
    const appointments = await DoctorPatient.find({ 
      patientId: req.user._id,
      isActive: true 
    })
    .populate('doctorId', 'firstName lastName email specialization')
    .sort({ assignedDate: -1 });

    res.status(200).json({
      message: 'Appointments retrieved successfully',
      count: appointments.length,
      data: appointments
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve appointments',
      code: 'FETCH_FAILED'
    });
  }
});

// PATCH /api/v1/patient/cancel/:appointmentId - Cancel appointment
router.patch('/cancel/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { jwt: token } = req.body;
    
    if (!token) {
      return res.status(401).json({ 
        message: 'JWT token is required',
        code: 'MISSING_JWT'
      });
    }

    // Verify token
    let patientUser;
    try {
      patientUser = await verifyTokenFromBody(token);
      
      if (!patientUser || patientUser.role !== 'patient') {
        return res.status(403).json({ 
          message: 'Invalid token or user not authorized',
          code: 'INVALID_USER'
        });
      }
    } catch (tokenError) {
      return res.status(403).json({ 
        message: 'Token verification failed',
        code: 'TOKEN_VERIFICATION_ERROR'
      });
    }

    // Find the appointment
    const appointment = await DoctorPatient.findOne({
      _id: appointmentId,
      patientId: patientUser._id
    });

    if (!appointment) {
      return res.status(404).json({ 
        message: 'Appointment not found',
        code: 'APPOINTMENT_NOT_FOUND'
      });
    }

    if (!appointment.isActive) {
      return res.status(400).json({ 
        message: 'Appointment already cancelled',
        code: 'ALREADY_CANCELLED'
      });
    }

    // Cancel the appointment by setting isActive to false
    appointment.isActive = false;
    appointment.notes = `${appointment.notes || ''}\n[CANCELLED] Cancelled by patient on ${new Date().toISOString()}`;

    await appointment.save();

    res.status(200).json({
      message: 'Appointment cancelled successfully',
      data: {
        appointmentId: appointment._id,
        status: 'cancelled',
        cancelledAt: new Date()
      }
    });

  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ 
      message: 'Failed to cancel appointment',
      code: 'CANCEL_FAILED'
    });
  }
});

// GET /api/v1/patient/doctors - Get available doctors (using header auth)
router.get('/doctors', auth, authorize('patient'), async (req, res) => {
  try {
    const { specialization, search } = req.query;
    
    let query = { role: 'doctor' };
    
    // Add specialization filter if provided
    if (specialization) {
      query.specialization = new RegExp(specialization, 'i');
    }
    
    // Add search filter if provided (search in name)
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') }
      ];
    }
    
    const doctors = await User.find(query)
      .select('firstName lastName email specialization')
      .sort({ firstName: 1 });

    res.status(200).json({
      message: 'Doctors retrieved successfully',
      count: doctors.length,
      data: doctors
    });

  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve doctors',
      code: 'FETCH_FAILED'
    });
  }
});

router.patch('/confirm-payment/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { jwt: token } = req.body;
    
    if (!token) {
      return res.status(401).json({ 
        message: 'JWT token is required',
        code: 'MISSING_JWT'
      });
    }

    // Verify token
    let patientUser;
    try {
      patientUser = await verifyTokenFromBody(token);
      
      if (!patientUser || patientUser.role !== 'patient') {
        return res.status(403).json({ 
          message: 'Invalid token or user not authorized',
          code: 'INVALID_USER'
        });
      }
    } catch (tokenError) {
      return res.status(403).json({ 
        message: 'Token verification failed',
        code: 'TOKEN_VERIFICATION_ERROR'
      });
    }

    // Find the appointment
    const appointment = await DoctorPatient.findOne({
      _id: appointmentId,
      patientId: patientUser._id
    });

    if (!appointment) {
      return res.status(404).json({ 
        message: 'Appointment not found',
        code: 'APPOINTMENT_NOT_FOUND'
      });
    }

    if (appointment.isPaid) {
      return res.status(400).json({ 
        message: 'Payment already confirmed',
        code: 'ALREADY_PAID'
      });
    }

    // Update the appointment status
    appointment.isPaid = true;
    appointment.status = 'active';
    appointment.notes = `${appointment.notes || ''}\n[PAYMENT] Payment confirmed on ${new Date().toISOString()}`;

    await appointment.save();

    res.status(200).json({
      message: 'Payment confirmed and appointment activated',
      data: {
        appointmentId: appointment._id,
        status: 'active',
        paidAt: new Date(),
        doctorId: appointment.doctorId,
        patientId: appointment.patientId
      }
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ 
      message: 'Failed to confirm payment',
      code: 'PAYMENT_CONFIRMATION_FAILED'
    });
  }
});

module.exports = router;
