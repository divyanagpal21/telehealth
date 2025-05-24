const mongoose = require('mongoose');

const doctorPatientSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create compound index to ensure unique doctor-patient relationships
doctorPatientSchema.index({ doctorId: 1, patientId: 1 }, { unique: true });

// Index for faster queries
doctorPatientSchema.index({ doctorId: 1, isActive: 1 });
doctorPatientSchema.index({ patientId: 1, isActive: 1 });

module.exports = mongoose.model('DoctorPatient', doctorPatientSchema);