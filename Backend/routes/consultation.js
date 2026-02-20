const express = require('express');
const router = express.Router();
const { startConsultation, getMyConsultations, endConsultation, saveNotes } = require('../controlers/consultationController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Doctor starts a consultation
router.post('/start', verifyToken, requireRole('doctor'), startConsultation);

// Get active consultations (for both doctor and patient)
router.get('/active', verifyToken, getMyConsultations);

// End a consultation
router.put('/:consultationId/end', verifyToken, endConsultation);

// Save notes (doctor only)
router.put('/:consultationId/notes', verifyToken, requireRole('doctor'), saveNotes);

module.exports = router;
