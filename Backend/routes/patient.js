const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, submitFeedback, getMyFeedbacks } = require('../controlers/patientController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/profile', verifyToken, requireRole('patient'), getProfile);
router.put('/profile', verifyToken, requireRole('patient'), updateProfile);
router.post('/feedback', verifyToken, requireRole('patient'), submitFeedback);
router.get('/feedback', verifyToken, requireRole('patient'), getMyFeedbacks);

module.exports = router;
