const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { auth, authorize } = require('../middleware/auth');
const { getPatients, getPatient, selectPatient , getDoctors} = require('../controllers/doctorController');


// GET /api/v1/doctor/getPatients - Get all patient IDs for a doctor
router.get('/getPatients', auth, authorize('doctor'), doctorController.getPatients);

// GET /api/v1/doctor/getPatient/:patientId - Get specific patient data
router.get('/getPatient/:patientId', auth, authorize('doctor'), doctorController.getPatient);

//GET api/v1/doctor/select
router.post('/select', auth, selectPatient);

// api/v1/patient/getDoctors
// For patients only
router.get('/getDoctors', auth, authorize('patient'), getDoctors);

// Or for both patients and doctors
router.get('/getDoctors', auth, getDoctors);

module.exports = router;