const mongoose = require('mongoose');
const { Schema } = mongoose;

const consultationSchema = new Schema({
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed', 'missed'],
    default: 'waiting',
  },
  startedAt: { type: Date },
  endedAt: { type: Date },
  duration: { type: Number, default: 0 }, // in seconds
  notes: { type: String, default: '' },
  prescription: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);
