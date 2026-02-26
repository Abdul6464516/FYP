const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require('../controlers/notificationController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All routes are doctor-only
router.get('/', verifyToken, requireRole('doctor'), getNotifications);
router.get('/unread-count', verifyToken, requireRole('doctor'), getUnreadCount);
router.put('/read-all', verifyToken, requireRole('doctor'), markAllAsRead);
router.put('/:id/read', verifyToken, requireRole('doctor'), markAsRead);

module.exports = router;
