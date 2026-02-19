const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorProfile, updateDoctorProfile, getDoctorAppointments, approveAppointment, cancelAppointmentByDoctor } = require('../controlers/doctorController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Public route — any logged-in user can search doctors
router.get('/list', verifyToken, getAllDoctors);

// Doctor-only routes
router.get('/profile', verifyToken, requireRole('doctor'), getDoctorProfile);
router.put('/profile', verifyToken, requireRole('doctor'), updateDoctorProfile);
router.get('/appointments', verifyToken, requireRole('doctor'), getDoctorAppointments);
router.put('/appointment/:id/approve', verifyToken, requireRole('doctor'), approveAppointment);
router.put('/appointment/:id/cancel', verifyToken, requireRole('doctor'), cancelAppointmentByDoctor);

module.exports = router;
