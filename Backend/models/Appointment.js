const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },       // who is booking
  doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },        // which doctor
  date: { type: String, required: true },                                       // e.g. "2026-03-01"
  time: { type: String, required: true },                                       // e.g. "10:00 AM"
  status: {
    type: String,
    enum: ['pending', 'approved', 'cancelled', 'completed'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['online', 'in-person'],
    default: 'online',
  },
  reason: { type: String, default: '' },                                        // reason for visit / symptoms
  notes: { type: String, default: '' },                                         // additional notes by patient
  doctorRemarks: { type: String, default: '' },                                 // doctor's remarks on approval/cancel
  fee: { type: Number, default: 0 },                                           // consultation fee (auto-filled from doctor's chargesPerSession)
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
