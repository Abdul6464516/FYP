const Notification = require('../models/Notification');

// GET /api/doctor/notifications — get all notifications for the logged-in doctor
async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate('relatedUser', 'fullName email')
      .populate('relatedAppointment', 'date time status')
      .sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/doctor/notifications/unread-count — get count of unread notifications
async function getUnreadCount(req, res) {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      status: 'unread',
    });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PUT /api/doctor/notifications/:id/read — mark a single notification as read
async function markAsRead(req, res) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { status: 'read' },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification marked as read', notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PUT /api/doctor/notifications/read-all — mark all notifications as read
async function markAllAsRead(req, res) {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, status: 'unread' },
      { status: 'read' }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllAsRead };
