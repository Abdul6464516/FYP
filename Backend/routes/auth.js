const express = require('express');
const router = express.Router();
const { register, login, me, getLoginHistory, getLoginStats, getAllLoginLogs, getSuspiciousLogins } = require('../controlers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, me);
router.get('/login-history', verifyToken, getLoginHistory);
router.get('/login-stats', verifyToken, getLoginStats);
router.get('/admin/all-login-logs', verifyToken, getAllLoginLogs);
router.get('/admin/suspicious-logins', verifyToken, getSuspiciousLogins);

module.exports = router;
