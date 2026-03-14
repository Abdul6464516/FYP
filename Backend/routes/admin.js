const express = require('express');
const router = express.Router();
const {
  getAdminProfile,
  updateAdminProfile,
  getAllAdmins,
  getAdminById,
  createAdmin,
  deleteAdmin,
  getPendingDoctors,
  getPendingPatients,
  verifyUser,
  rejectUser,
  getVerifiedUsersByRole,
  getAllDoctors,
  getAllPatients
} = require('../controlers/adminController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Get current admin profile (requires authentication and admin role)
router.get('/profile', verifyToken, requireRole('admin'), getAdminProfile);

// Update admin profile (requires authentication and admin role)
router.put('/profile', verifyToken, requireRole('admin'), updateAdminProfile);

// Get all admins (requires authentication and admin role)
router.get('/all', verifyToken, requireRole('admin'), getAllAdmins);

// Get single admin by ID (requires authentication and admin role)
router.get('/:adminId', verifyToken, requireRole('admin'), getAdminById);

// Create new admin (requires authentication and admin role)
router.post('/create', verifyToken, requireRole('admin'), createAdmin);

// Delete admin (requires authentication and admin role)
router.delete('/:adminId', verifyToken, requireRole('admin'), deleteAdmin);

// Get all pending doctors for verification (requires authentication and admin role)
router.get('/verification/pending-doctors', verifyToken, requireRole('admin'), getPendingDoctors);

// Get all pending patients for verification (requires authentication and admin role)
router.get('/verification/pending-patients', verifyToken, requireRole('admin'), getPendingPatients);

// Get all verified users by role (requires authentication and admin role)
router.get('/verification/verified/:role', verifyToken, requireRole('admin'), getVerifiedUsersByRole);

// Verify a doctor or patient (requires authentication and admin role)
router.put('/verification/verify/:userId', verifyToken, requireRole('admin'), verifyUser);

// Reject a doctor or patient (requires authentication and admin role)
router.put('/verification/reject/:userId', verifyToken, requireRole('admin'), rejectUser);

// Get all doctors with all verification statuses (requires authentication and admin role)
router.get('/verification/all-doctors', verifyToken, requireRole('admin'), getAllDoctors);

// Get all patients with all verification statuses (requires authentication and admin role)
router.get('/verification/all-patients', verifyToken, requireRole('admin'), getAllPatients);

module.exports = router;
