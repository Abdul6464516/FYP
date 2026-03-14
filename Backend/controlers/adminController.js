const User = require('../models/User');

// Get admin profile (the logged-in admin)
async function getAdminProfile(req, res) {
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const adminResponse = admin.toObject();
    delete adminResponse.password;
    res.json(adminResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update admin profile
async function updateAdminProfile(req, res) {
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const { fullName, email, username, phone, city } = req.body;

    // Validate required fields
    if (!fullName || !email || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if email or username are already taken by another user
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
      _id: { $ne: adminId }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email or username already in use' });
    }

    const updatedAdmin = await User.findByIdAndUpdate(
      adminId,
      { fullName, email, username, phone, city },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const adminResponse = updatedAdmin.toObject();
    delete adminResponse.password;
    res.json({ message: 'Admin profile updated successfully', user: adminResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all admins (for admin management)
async function getAllAdmins(req, res) {
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get single admin by ID (for user management)
async function getAdminById(req, res) {
  try {
    const { adminId } = req.params;
    const admin = await User.findById(adminId).select('-password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Create a new admin
async function createAdmin(req, res) {
  try {
    const { fullName, email, username, password, phone, city } = req.body;

    // Validate required fields
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if email or username already exist
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: 'Email or username already in use' });
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const admin = new User({
      fullName,
      email,
      username,
      password: hash,
      phone,
      city,
      role: 'admin'
    });

    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;
    res.status(201).json({ message: 'Admin created successfully', user: adminResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete an admin
async function deleteAdmin(req, res) {
  try {
    const { adminId } = req.params;
    const loggedInAdminId = req.user && req.user.id;

    // Prevent admin from deleting themselves
    if (adminId === loggedInAdminId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const deletedAdmin = await User.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all pending doctors for verification
async function getPendingDoctors(req, res) {
  try {
    const doctors = await User.find({ 
      role: 'doctor', 
      verificationStatus: 'pending' 
    }).select('-password');
    
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all pending patients for verification
async function getPendingPatients(req, res) {
  try {
    const patients = await User.find({ 
      role: 'patient', 
      verificationStatus: 'pending' 
    }).select('-password');
    
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Verify a doctor or patient
async function verifyUser(req, res) {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot verify admin users' });
    }

    if (user.verificationStatus === 'verified') {
      return res.status(400).json({ message: 'User is already verified' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { verificationStatus: 'verified' },
      { new: true }
    ).select('-password');

    res.json({ 
      message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} verified successfully`, 
      user: updatedUser 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Reject a doctor or patient
async function rejectUser(req, res) {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot reject admin users' });
    }

    if (user.verificationStatus === 'rejected') {
      return res.status(400).json({ message: 'User is already rejected' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { verificationStatus: 'rejected' },
      { new: true }
    ).select('-password');

    res.json({ 
      message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} rejected successfully`, 
      user: updatedUser 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all verified users by role
async function getVerifiedUsersByRole(req, res) {
  try {
    const { role } = req.params;
    
    if (!['doctor', 'patient'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const users = await User.find({ 
      role: role, 
      verificationStatus: 'verified' 
    }).select('-password');
    
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all doctors with all verification statuses
async function getAllDoctors(req, res) {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all patients with all verification statuses
async function getAllPatients(req, res) {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
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
};
