const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema({
	name: { type: String, required: true },
	gender: { type: String },
	age: { type: Number },
	email: { type: String },
	phone: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
