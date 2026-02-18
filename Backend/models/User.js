const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },

  // Patient-specific fields
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  phone: { type: String },
  medicalHistory: { type: String },

  // Doctor-specific fields
  specialty: { type: String },
  qualifications: { type: String },
  yearsOfExperience: { type: Number },
  availability: { type: String },
  chargesPerSession: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
