const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['booking', 'approved', 'cancelled', 'completed', 'general'],
    default: 'general',
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedAppointment: { type: Schema.Types.ObjectId, ref: 'Appointment', default: null },
  relatedUser: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
  },
}, { timestamps: true });

// Index for fast queries on recipient + status
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
