const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedbackSchema = new Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  totalRating: { type: Number, default: 5 },  // out of 5
  message: { type: String, default: '' },
  reviewBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },   // patient
  reviewOn: { type: Schema.Types.ObjectId, ref: 'User', required: true },   // doctor
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
