const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorProfile, updateDoctorProfile } = require('../controlers/doctorController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Public route — any logged-in user can search doctors
router.get('/list', verifyToken, getAllDoctors);

// Doctor-only routes
router.get('/profile', verifyToken, requireRole('doctor'), getDoctorProfile);
router.put('/profile', verifyToken, requireRole('doctor'), updateDoctorProfile);

module.exports = router;
