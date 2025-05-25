const User = require('../models/User');
const DoctorPatient = require('../models/DoctorPatient');

// GET /api/v1/doctor/getPatients
// Get all patient IDs associated with a doctor
const getPatients = async (req, res) => {
  try {
    // Find all doctor-patient relationships for this doctor
    const doctorPatientRelations = await DoctorPatient.find({ 
      doctorId: req.user._id,
      isActive: true 
    }).select('patientId');

    // Extract patient IDs
    const patientIDs = doctorPatientRelations.map(relation => relation.patientId);

    res.status(200).json({
      success: true,
      patientIDs: patientIDs
    });

  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// GET /api/v1/doctor/getPatient/:patientId
// Get specific patient data by patient ID
const getPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Input validation
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    // Verify that this doctor has access to this patient
    const doctorPatientRelation = await DoctorPatient.findOne({
      doctorId: req.user._id,
      patientId: patientId,
      isActive: true
    });

    if (!doctorPatientRelation) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found or access denied.'
      });
    }

    // Get patient data (excluding sensitive information like password)
    const patient = await User.findById(patientId)
      .select('-password -__v')
      .lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.'
      });
    }

    // Ensure the user is actually a patient
    if (patient.role !== 'patient') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient data retrieved successfully',
      data: {
        patient: patient,
        relationshipInfo: {
          isActive: doctorPatientRelation.isActive,
          establishedDate: doctorPatientRelation.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Error fetching patient:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format'
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// POST /api/v1/doctor/select
// Accept or reject a patient consultation request
const selectPatient = async (req, res) => {
  try {
    const { patientId, decision } = req.body;
    const doctorId = req.user._id;

    // Input validation
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    if (!decision || !['accept', 'reject'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: 'Decision must be either "accept" or "reject"'
      });
    }

    // Check if patient exists and is actually a patient
    const patient = await User.findById(patientId);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    if (patient.role !== 'patient') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID'
      });
    }

    // Check if there's already a doctor-patient relationship
    let doctorPatientRelation = await DoctorPatient.findOne({
      doctorId: doctorId,
      patientId: patientId
    });

    if (decision === 'accept') {
      if (doctorPatientRelation) {
        // Update existing relationship to active
        doctorPatientRelation.isActive = true;
        doctorPatientRelation.status = 'accepted';
        doctorPatientRelation.acceptedAt = new Date();
        doctorPatientRelation.updatedAt = new Date();
        await doctorPatientRelation.save();
      } else {
        // Create new relationship
        doctorPatientRelation = new DoctorPatient({
          doctorId: doctorId,
          patientId: patientId,
          isActive: true,
          status: 'accepted',
          acceptedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        await doctorPatientRelation.save();
      }

      return res.status(200).json({
        success: true,
        message: 'Patient consultation request accepted successfully'
      });

    } else if (decision === 'reject') {
      if (doctorPatientRelation) {
        // Update existing relationship to rejected
        doctorPatientRelation.isActive = false;
        doctorPatientRelation.status = 'rejected';
        doctorPatientRelation.rejectedAt = new Date();
        doctorPatientRelation.updatedAt = new Date();
        await doctorPatientRelation.save();
      } else {
        // Create new relationship with rejected status
        doctorPatientRelation = new DoctorPatient({
          doctorId: doctorId,
          patientId: patientId,
          isActive: false,
          status: 'rejected',
          rejectedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        await doctorPatientRelation.save();
      }

      return res.status(200).json({
        success: true,
        message: 'Patient consultation request rejected'
      });
    }

  } catch (error) {
    console.error('Error processing patient selection:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// GET /api/v1/patient/getDoctors
// Get all available doctors for booking (for patients)
const getDoctors = async (req, res) => {
  try {
    // Optional query parameters for filtering
    const { 
      specialization, 
      location, 
      availableOnly, 
      sortBy, 
      limit, 
      offset 
    } = req.query;

    // Build query for doctors
    let query = { role: 'doctor' };

    // Filter by specialization if provided
    if (specialization) {
      query.specialization = { 
        $regex: specialization, 
        $options: 'i' 
      };
    }

    // Filter by location if provided
    if (location) {
      query.location = { 
        $regex: location, 
        $options: 'i' 
      };
    }

    // Filter by availability if requested
    if (availableOnly === 'true') {
      query.isAvailable = true;
    }

    // Execute query to get doctors
    let doctorsQuery = User.find(query)
      .select('-password -__v -createdAt -updatedAt')
      .lean();

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 'rating':
          doctorsQuery = doctorsQuery.sort({ rating: -1 });
          break;
        case 'experience':
          doctorsQuery = doctorsQuery.sort({ experience: -1 });
          break;
        case 'fee':
          doctorsQuery = doctorsQuery.sort({ consultationFee: 1 });
          break;
        case 'name':
          doctorsQuery = doctorsQuery.sort({ name: 1 });
          break;
        default:
          doctorsQuery = doctorsQuery.sort({ rating: -1 });
      }
    } else {
      // Default sort by rating
      doctorsQuery = doctorsQuery.sort({ rating: -1 });
    }

    // Get total count before pagination
    const totalDoctors = await User.countDocuments(query);

    // Apply pagination
    const startIndex = parseInt(offset) || 0;
    const limitNum = parseInt(limit) || 20; // Default limit of 20
    
    doctorsQuery = doctorsQuery.skip(startIndex).limit(limitNum);

    // Execute the query
    const doctors = await doctorsQuery;

    // Get unique specializations and locations for metadata
    const allDoctors = await User.find({ role: 'doctor' })
      .select('specialization location')
      .lean();
    
    const specializations = [...new Set(
      allDoctors
        .map(doc => doc.specialization)
        .filter(spec => spec)
    )];
    
    const locations = [...new Set(
      allDoctors
        .map(doc => doc.location)
        .filter(loc => loc)
    )];

    // Format doctor data for response
    const formattedDoctors = doctors.map(doctor => ({
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization || 'General Practice',
      qualification: doctor.qualification || 'MD',
      experience: doctor.experience || 0,
      rating: doctor.rating || 0,
      consultationFee: doctor.consultationFee || 0,
      availableSlots: doctor.availableSlots || [],
      hospital: doctor.hospital || '',
      location: doctor.location || '',
      profileImage: doctor.profileImage || '',
      languages: doctor.languages || ['English'],
      isAvailable: doctor.isAvailable !== false, // Default to true if not specified
      nextAvailableDate: doctor.nextAvailableDate || new Date().toISOString().split('T')[0],
      phone: doctor.phone || '',
      bio: doctor.bio || ''
    }));

    // Response metadata
    const metadata = {
      total: totalDoctors,
      returned: formattedDoctors.length,
      offset: startIndex,
      limit: limitNum,
      specializations,
      locations,
      filters: {
        specialization: specialization || null,
        location: location || null,
        availableOnly: availableOnly === 'true',
        sortBy: sortBy || 'rating'
      }
    };

    res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data: {
        doctors: formattedDoctors,
        metadata
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching doctors:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
module.exports = {
  getPatients,
  getPatient,
  selectPatient,
  getDoctors
};