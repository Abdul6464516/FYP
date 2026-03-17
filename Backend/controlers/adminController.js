const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Consultation = require('../models/Consultation');
const Feedback = require('../models/Feedback');

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

// System Monitoring - Get live statistics
async function getSystemMonitoring(req, res) {
  try {
    // Get today's date in YYYY-MM-DD format without timezone issues
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`; // Format: "2026-03-14"
        
    // Get total consultations (active + completed) for today
    const totalConsultations = await Consultation.countDocuments({
      $or: [
        { status: 'active' },
        { status: 'completed' }
      ]
    });
    
    // Get total appointments with today's date (all statuses)
    const appointmentsToday = await Appointment.countDocuments({
      date: todayString
    });
    
   
    
    // Calculate average wait time (from pending to approved)
    const pendingAppointments = await Appointment.find({ status: 'pending' }).limit(10);
    let avgWaitTime = 0;
    if (pendingAppointments.length > 0) {
      const waitTimes = pendingAppointments.map(apt => {
        if (apt.updatedAt && apt.createdAt) {
          return (apt.updatedAt - apt.createdAt) / (1000 * 60); // in minutes
        }
        return 0;
      });
      avgWaitTime = Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length);
    }
    
    // Platform satisfaction (average rating from feedback)
    const feedbackData = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const platformSatisfaction = feedbackData[0] ? Math.round(feedbackData[0].avgRating * 20) : 94; // convert to percentage
    
    res.json({
      activeConsultations: totalConsultations,
      appointmentsToday,
      avgWaitTime: avgWaitTime || 8,
      platformSatisfaction
    });
  } catch (err) {
    console.error('Error in getSystemMonitoring:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get recent activity feed
async function getRecentActivity(req, res) {
  try {
    const limit = 10;
    const activity = [];
    
    // Recent appointments
    const recentAppointments = await Appointment.find()
      .populate('patient', 'fullName')
      .populate('doctor', 'fullName')
      .sort({ createdAt: -1 })
      .limit(5);
    
    recentAppointments.forEach(apt => {
      activity.push({
        id: apt._id,
        user: apt.patient?.fullName || 'Unknown',
        action: 'booked an appointment with',
        target: apt.doctor?.fullName || 'Dr. Unknown',
        time: getTimeAgo(apt.createdAt),
        type: 'appointment'
      });
    });
    
    // Recent consultations
    const recentConsultations = await Consultation.find()
      .populate('patient', 'fullName')
      .populate('doctor', 'fullName')
      .sort({ createdAt: -1 })
      .limit(5);
    
    recentConsultations.forEach(cons => {
      activity.push({
        id: cons._id,
        user: cons.doctor?.fullName || 'Dr. Unknown',
        action: 'started a video call with',
        target: cons.patient?.fullName || 'Unknown',
        time: getTimeAgo(cons.createdAt),
        type: 'consultation'
      });
    });
    
    // Sort by time and return top 10
    activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(activity.slice(0, limit));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get latest feedback
async function getLatestFeedback(req, res) {
  try {
    const limit = req.query.limit || 10;
    
    const feedbackData = await Feedback.find()
      .populate('reviewBy', 'fullName')
      .populate('reviewOn', 'fullName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    const feedback = feedbackData.map(f => ({
      id: f._id,
      patient: f.reviewBy?.fullName || 'Unknown',
      doctorName: f.reviewOn?.fullName || 'Dr. Unknown',
      rating: f.rating,
      comment: f.message || 'No comment provided'
    }));
    
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Helper function to format time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Get analytics - Top performing doctors with ratings
async function getTopDoctors(req, res) {
  try {
    const topDoctors = await Feedback.aggregate([
      {
        $group: {
          _id: "$reviewOn",
          avgRating: { $avg: "$rating" },
          consultationCount: { $sum: 1 }
        }
      },
      { $sort: { consultationCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "doctorInfo"
        }
      },
      { $unwind: "$doctorInfo" },
      {
        $project: {
          _id: 0,
          doctorId: "$_id",
          name: "$doctorInfo.fullName",
          consultations: "$consultationCount",
          rating: { $round: ["$avgRating", 1] }
        }
      }
    ]);

    res.json(topDoctors);
  } catch (err) {
    console.error('Error fetching top doctors:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get KPI metrics
async function getKPIMetrics(req, res) {
  try {
    // Total consultations count
    const totalConsultations = await Consultation.countDocuments();

    // New user registrations (assuming users have createdAt)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      role: { $in: ['doctor', 'patient'] }
    });

    // Last month consultations for trend
    const lastMonthConsultations = await Consultation.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Calculate percentage changes
    const totalConsultationsLastMonth = await Consultation.countDocuments({
      createdAt: {
        $gte: new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
        $lt: thirtyDaysAgo
      }
    });

    const consultationsTrend = totalConsultationsLastMonth > 0
      ? (((totalConsultations - totalConsultationsLastMonth) / totalConsultationsLastMonth) * 100).toFixed(1)
      : 0;

    res.json({
      totalConsultations,
      newRegistrations,
      consultationsTrend: parseFloat(consultationsTrend),
      consultationsLastMonth: lastMonthConsultations
    });
  } catch (err) {
    console.error('Error fetching KPI metrics:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get engagement metrics
async function getEngagementMetrics(req, res) {
  try {
    // Patient Retention: percentage of returning patients
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const returningPatients = await Consultation.aggregate([
      { $group: { _id: "$patient" } },
      { $count: "total" }
    ]);
    const patientRetention = totalPatients > 0
      ? Math.round((returningPatients[0]?.total || 0 / totalPatients) * 100)
      : 0;

    // App Usage Frequency: consultations per doctor (active doctors)
    const activeDoctors = await User.countDocuments({ role: 'doctor' });
    const totalConsultations = await Consultation.countDocuments();
    const appUsageFrequency = activeDoctors > 0
      ? Math.round((totalConsultations / activeDoctors) * 10)
      : 0;

    // Consultation Completion: completed consultations percentage
    const completedConsultations = await Consultation.countDocuments({ status: 'completed' });
    const allConsultations = await Consultation.countDocuments();
    const completionRate = allConsultations > 0
      ? Math.round((completedConsultations / allConsultations) * 100)
      : 0;

    const metrics = [
      { label: "Patient Retention", value: Math.min(patientRetention, 100), color: "#4f46e5" },
      { label: "App Usage Frequency", value: Math.min(appUsageFrequency, 100), color: "#16a34a" },
      { label: "Consultation Completion", value: completionRate, color: "#f59e0b" }
    ];

    res.json(metrics);
  } catch (err) {
    console.error('Error fetching engagement metrics:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get monthly consultation trend data
async function getConsultationTrend(req, res) {
  try {
    const months = [];
    const consultationData = [];

    // Get last 6 months data
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthName = startOfMonth.toLocaleDateString('en-US', { month: 'short' });
      months.push(monthName);

      const count = await Consultation.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });
      consultationData.push(count);
    }

    res.json({ months, consultationData });
  } catch (err) {
    console.error('Error fetching consultation trend:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// ============ SECURITY & PRIVACY CONTROLLERS ============

// Get security logs
async function getSecurityLogs(req, res) {
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const securityLogs = [
      { id: 1, event: "Database Backup", status: "Success", time: "2 hours ago", ip: "192.168.1.1" },
      { id: 2, event: "Unauthorized Login Attempt", status: "Blocked", time: "5 hours ago", ip: "45.12.33.102" },
      { id: 3, event: "Encryption Key Rotated", status: "Success", time: "1 day ago", ip: "Internal System" },
      { id: 4, event: "Patient Data Exported", status: "Success", time: "3 days ago", ip: "192.168.1.50" },
      { id: 5, event: "User Access Verified", status: "Success", time: "4 days ago", ip: "192.168.1.75" }
    ];

    res.json(securityLogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get patient data access records
async function getPatientDataAccess(req, res) {
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const patientDataAccess = [
      { id: 1, staffName: "Dr. Ahmed Hassan", role: "Doctor", recordsAccessed: 45, lastAccess: "30 mins ago", encrypted: true },
      { id: 2, staffName: "Dr. Fatima Khan", role: "Doctor", recordsAccessed: 23, lastAccess: "2 hours ago", encrypted: true },
      { id: 3, staffName: "Support Agent", role: "Staff", recordsAccessed: 5, lastAccess: "1 day ago", encrypted: true },
      { id: 4, staffName: "Dr. Hassan Ali", role: "Doctor", recordsAccessed: 67, lastAccess: "1 hour ago", encrypted: true }
    ];

    res.json(patientDataAccess);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get consultation encryption status
async function getConsultationEncryption(req, res) {
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const consultationEncryption = [
      { id: 1, type: "Video Consultation", encrypted: true, keyStatus: "Active", rotationDate: "2025-12-15", coverage: "100%" },
      { id: 2, type: "Text Consultation", encrypted: true, keyStatus: "Active", rotationDate: "2025-12-15", coverage: "100%" },
      { id: 3, type: "Prescription Records", encrypted: true, keyStatus: "Active", rotationDate: "2025-12-15", coverage: "100%" }
    ];

    res.json(consultationEncryption);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get data retention policies
async function getDataRetentionPolicies(req, res) {
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const dataRetentionPolicies = [
      { id: 1, dataType: "Patient Medical Records", retentionDays: 2555, policy: "7 years (per regulations)", status: "Compliant" },
      { id: 2, dataType: "Consultation Logs", retentionDays: 1095, policy: "3 years", status: "Compliant" },
      { id: 3, dataType: "Access Audit Logs", retentionDays: 365, policy: "1 year", status: "Compliant" },
      { id: 4, dataType: "Payment Records", retentionDays: 1825, policy: "5 years (per tax law)", status: "Compliant" }
    ];

    res.json(dataRetentionPolicies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get pending data deletion requests
async function getPendingDeletions(req, res) {
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const pendingDeletions = [
      { id: 1, patientId: "P10023", reason: "Patient Request", initiatedBy: "Admin", date: "2 days ago", status: "Pending Review" },
      { id: 2, patientId: "P10024", reason: "Data Retention Policy", initiatedBy: "System", date: "5 days ago", status: "Completed" },
      { id: 3, patientId: "P10025", reason: "Patient Request", initiatedBy: "Patient", date: "1 day ago", status: "Pending Review" }
    ];

    res.json(pendingDeletions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get staff confidentiality compliance
async function getStaffCompliance(req, res) {
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const staffCompliance = [
      { id: 1, staffName: "Dr. Ahmed Hassan", complianceStatus: "Compliant", privacyAgreement: "Signed", lastTraining: "30 days ago", confidentialityScore: "95%" },
      { id: 2, staffName: "Dr. Fatima Khan", complianceStatus: "Compliant", privacyAgreement: "Signed", lastTraining: "45 days ago", confidentialityScore: "90%" },
      { id: 3, staffName: "Support Agent", complianceStatus: "Pending", privacyAgreement: "Pending", lastTraining: "Never", confidentialityScore: "75%" },
      { id: 4, staffName: "Dr. Hassan Ali", complianceStatus: "Compliant", privacyAgreement: "Signed", lastTraining: "15 days ago", confidentialityScore: "98%" }
    ];

    res.json(staffCompliance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get patient consent records
async function getPatientConsent(req, res) {
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const patientConsent = [
      { id: 1, patientId: "P10001", consentType: "Medical Data Sharing", status: "Consented", date: "2025-01-10" },
      { id: 2, patientId: "P10002", consentType: "Research Participation", status: "Not Consented", date: "N/A" },
      { id: 3, patientId: "P10003", consentType: "Video Recording", status: "Consented", date: "2025-02-15" },
      { id: 4, patientId: "P10004", consentType: "Medical Data Sharing", status: "Consented", date: "2025-02-20" }
    ];

    res.json(patientConsent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Approve data deletion request
async function approveDeletion(req, res) {
  try {
    const adminId = req.user && req.user.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const { deletionId } = req.params;

    // In a real scenario, this would update the database
    // For now, return success response
    res.json({
      message: 'Deletion request approved successfully',
      deletionId: deletionId,
      status: 'Completed',
      approvedAt: new Date(),
      approvedBy: adminId
    });
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
  getAllPatients,
  getSystemMonitoring,
  getRecentActivity,
  getLatestFeedback,
  getTopDoctors,
  getKPIMetrics,
  getEngagementMetrics,
  getConsultationTrend,
  getSecurityLogs,
  getPatientDataAccess,
  getConsultationEncryption,
  getDataRetentionPolicies,
  getPendingDeletions,
  getStaffCompliance,
  getPatientConsent,
  approveDeletion
};
