const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicationSchema = new Schema({
  name:      { type: String, required: true },
  dosage:    { type: String, required: true },
  frequency: { type: String, required: true },
  duration:  { type: String, required: true },
}, { _id: false });

const prescriptionSchema = new Schema({
  doctor:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  patient:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  appointment:  { type: Schema.Types.ObjectId, ref: 'Appointment' },
  consultation: { type: Schema.Types.ObjectId, ref: 'Consultation' },

  medications:  { type: [medicationSchema], required: true, validate: v => v.length > 0 },

  instructions: { type: String, default: '' },   // additional advice / notes
  diagnosis:    { type: String, default: '' },

  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed'],
    default: 'sent',
  },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
