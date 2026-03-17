# 🏥 Telemedicine Platform - Real-Time Appointment & Consultation System

A comprehensive web-based telemedicine platform enabling patients to book consultations with doctors, conduct video/text consultations, manage medical records, and receive prescriptions—all with enterprise-grade security, role-based access control, and real-time features.

**Status**: ✅ Production-Ready | **Version**: 1.0.0 | **License**: ISC

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Features by User Role](#features-by-user-role)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)

---

## 🎯 Project Overview

This telemedicine platform revolutionizes healthcare delivery by connecting patients with qualified doctors through a secure, user-friendly digital interface. It streamlines the entire patient journey from appointment booking to prescription management while maintaining HIPAA/GDPR compliance through comprehensive security protocols.

### Key Highlights:
- 🔐 **Military-grade encryption** for patient data
- 📊 **Real-time collaboration** with WebSocket (Socket.IO)
- 👥 **Role-based access control** (Patient, Doctor, Admin)
- 🎥 **Video/Text consultations** support
- 📱 **Responsive design** (Desktop & Mobile)
- 🚨 **Advanced security monitoring** with login activity tracking
- 📋 **Medical records management**
- 💊 **E-prescription system**
- ⏰ **Real-time appointment management**

---

## 👥 Features by User Role

### 🏥 **PATIENT** Features

#### Dashboard
- View upcoming appointments
- See consultation history
- Track medical records
- Monitor prescription status
- Real-time notifications

#### Appointment Management
- ✅ Search doctors by specialty
- ✅ Filter by availability and ratings
- ✅ Book appointments with preferred time slots
- ✅ Cancel/reschedule appointments
- ✅ Receive appointment reminders
- ✅ View doctor profiles with qualifications

#### Consultations
- ✅ Join video consultations
- ✅ Text-based messaging
- ✅ Share medical history during consultation
- ✅ Download consultation reports
- ✅ Rate and review doctors

#### Medical Records
- ✅ View all medical records in one place
- ✅ Download records as PDF
- ✅ Share records with other doctors
- ✅ Track medical history timeline
- ✅ Maintain personal health notes

#### Prescriptions
- ✅ View e-prescriptions from doctors
- ✅ Download prescription PDF
- ✅ Print prescriptions
- ✅ Set prescription reminders
- ✅ Access prescription history

#### Account Management
- ✅ Update profile information
- ✅ Change password
- ✅ View login activity/sessions
- ✅ Manage consent preferences
- ✅ Control data sharing settings

#### Feedback & Support
- ✅ Rate consultations
- ✅ Leave feedback for doctors
- ✅ Contact support
- ✅ Submit complaints

---

### 👨‍⚕️ **DOCTOR** Features

#### Dashboard
- View today's appointments
- Incoming consultation requests
- Patient statistics
- Performance metrics
- Income/earnings overview

#### Appointment Management
- ✅ View all scheduled appointments
- ✅ Mark appointments as completed
- ✅ Reschedule appointments
- ✅ Set availability calendar
- ✅ Receive appointment notifications
- ✅ View patient details before consultation

#### Consultations
- ✅ Join video consultations
- ✅ Text consultation support
- ✅ View patient medical history
- ✅ Record consultation notes
- ✅ Generate consultation reports
- ✅ Schedule follow-up appointments

#### Patient Management
- ✅ View all patient records
- ✅ Manage patient history
- ✅ Add medical notes/observations
- ✅ Track patient progress
- ✅ Export patient reports

#### Prescription Generation
- ✅ Create e-prescriptions
- ✅ Add medications with dosage
- ✅ Set prescription validity period
- ✅ Add special instructions
- ✅ Send prescriptions digitally
- ✅ Track prescription history

#### Medical Reports
- ✅ Generate medical reports
- ✅ Attach lab reports
- ✅ Add diagnoses
- ✅ Document treatment plans
- ✅ Export as PDF

#### Profile & Settings
- ✅ Manage professional information
- ✅ Set consultation charges
- ✅ Update specialization
- ✅ Manage availability
- ✅ View credentials status
- ✅ Access login history

#### Notifications
- ✅ Real-time appointment alerts
- ✅ New consultation requests
- ✅ Patient feedback notifications
- ✅ System updates

---

### 👨‍💼 **ADMIN** Features

#### User Management
- ✅ Verify doctors (credential check)
- ✅ Verify patients
- ✅ Manage user roles
- ✅ Suspend/deactivate accounts
- ✅ View all users
- ✅ Handle user disputes

#### Doctor Verification
- ✅ Review doctor qualifications
- ✅ Approve/reject doctors
- ✅ Verify credentials
- ✅ Monitor doctor activities
- ✅ Handle complaints

#### System Monitoring
- ✅ Real-time system statistics
- ✅ Active user count
- ✅ Total consultations/appointments
- ✅ Revenue analytics
- ✅ System performance metrics
- ✅ Recent activity feed

#### Analytics & Reports
- ✅ Top performing doctors
- ✅ KPI metrics
- ✅ User engagement analytics
- ✅ Consultation trends
- ✅ Revenue reports
- ✅ Export reports as PDF

#### Security & Privacy Dashboard
- ✅ **Login Activity Logs** - Track all user logins with IP, location, device
- ✅ **Suspicious Login Detection** - Automatic anomaly flagging
- ✅ **Data Access Control** - Monitor staff accessing patient records
- ✅ **Consultation Encryption Status** - Verify end-to-end encryption
- ✅ **Data Retention Compliance** - Track data lifecycle
- ✅ **Pending Data Deletion** - Manage GDPR deletion requests
- ✅ **Staff Compliance** - Monitor privacy agreement compliance
- ✅ **Patient Consent Management** - Track patient consent forms
- ✅ **Encryption Key Management** - Rotate encryption keys
- ✅ **Audit Trails** - Complete access logs

#### Feedback Management
- ✅ View all feedback
- ✅ Monitor doctor ratings
- ✅ Handle complaints
- ✅ Export feedback reports

#### Settings & Configuration
- ✅ System configuration
- ✅ Email templates
- ✅ Payment settings
- ✅ Notification preferences
- ✅ API key management

---

## 🛠 Tech Stack

### Backend
```
Framework:       Express.js 5.x
Language:        Node.js (JavaScript)
Database:        MongoDB 9.x
ODM:            Mongoose 9.x
Authentication: JWT (JSON Web Tokens)
Real-time:      Socket.IO 4.x
Security:       bcryptjs, CORS
API Format:     RESTful JSON
Validation:     Mongoose schemas
```

### Frontend
```
Framework:      React 19.x
Build Tool:     Vite
Router:         React Router v7
UI Components:  Bootstrap 5
Icons:          Lucide React
Forms:          React Hook Form + Zod
State:          Context API + Custom Hooks
HTTP Client:    Axios
Real-time:      Socket.IO Client
PDF Export:     jsPDF
Charts:         Recharts
Notifications:  React-Toastify
```

### DevOps & Tools
```
Package Manager: npm
Runtime:        Node.js 16+
Database:       MongoDB Atlas (Cloud)
Real-time DB:   Socket.IO Events
Hosting:        Vercel & Render
SSL/TLS:        HTTPS
```

---

## 📁 Project Structure

```
FYP/
├── Backend/
│   ├── app.js                          # Express app configuration
│   ├── package.json                    # Dependencies
│   ├── .env                            # Environment variables
│   ├── config/
│   │   └── dbconfig.js                 # MongoDB connection
│   ├── models/                         # Mongoose schemas
│   │   ├── User.js                     # User schema
│   │   ├── Appointment.js              # Appointment schema
│   │   ├── Consultation.js             # Consultation schema
│   │   ├── Prescription.js             # Prescription schema
│   │   ├── Feedback.js                 # Feedback schema
│   │   ├── Notification.js             # Notification schema
│   │   └── LoginLog.js                 # Login activity schema
│   ├── routes/
│   │   ├── auth.js                     # Authentication routes
│   │   ├── patient.js                  # Patient routes
│   │   ├── doctor.js                   # Doctor routes
│   │   ├── admin.js                    # Admin routes
│   │   ├── appointment.js              # Appointment routes
│   │   ├── consultation.js             # Consultation routes
│   │   └── notification.js             # Notification routes
│   ├── controlers/                     # Business logic
│   │   ├── authController.js           # Auth logic
│   │   ├── patientController.js        # Patient logic
│   │   ├── doctorController.js         # Doctor logic
│   │   ├── adminController.js          # Admin logic
│   │   ├── appointmentController.js    # Appointment logic
│   │   ├── consultationController.js   # Consultation logic
│   │   └── notificationController.js   # Notification logic
│   └── middleware/
│       └── auth.js                     # JWT verification
│
├── Frontend/
│   ├── index.html                      # HTML entry point
│   ├── package.json                    # Dependencies
│   ├── vite.config.js                  # Vite configuration
│   ├── src/
│   │   ├── main.jsx                    # React entry point
│   │   ├── App.jsx                     # Main component
│   │   ├── App.css                     # Global styles
│   │   ├── index.css                   # Base styles
│   │   ├── responsive.css              # Responsive styles
│   │   ├── context/
│   │   │   └── UserContext.jsx         # Global user state
│   │   ├── pages/
│   │   │   ├── Home.jsx                # Landing page
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx           # Login page
│   │   │   │   └── SignUp.jsx          # Registration page
│   │   │   ├── patient/
│   │   │   │   └── PatientDashboard.jsx
│   │   │   ├── doctor/
│   │   │   │   └── DoctorDashboard.jsx
│   │   │   └── admin/
│   │   │       └── AdminDashboard.jsx
│   │   ├── Components/
│   │   │   ├── ProtectedRoute.jsx      # Route protection
│   │   │   ├── ProfileDropdown.jsx     # Profile menu
│   │   │   ├── Patient/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── PatientProfile.jsx
│   │   │   │   ├── AppointmentBooking.jsx
│   │   │   │   ├── MedicalRecords.jsx
│   │   │   │   ├── PerscriptionAccess.jsx
│   │   │   │   ├── FeedbackSystem.jsx
│   │   │   │   └── VideoCall.jsx
│   │   │   ├── Doctor/
│   │   │   │   ├── DoctorProfile.jsx
│   │   │   │   ├── AppointmentManagement.jsx
│   │   │   │   ├── ConsultationInterface.jsx
│   │   │   │   ├── PatientHistory.jsx
│   │   │   │   ├── PrescriptionGeneration.jsx
│   │   │   │   ├── MedicalReports.jsx
│   │   │   │   ├── NotificationCenter.jsx
│   │   │   │   └── DoctorSettings.jsx
│   │   │   └── Admin/
│   │   │       ├── UserManagement.jsx
│   │   │       ├── AdminProfile.jsx
│   │   │       ├── ReportsAnalytics.jsx
│   │   │       ├── SystemMonitoring.jsx
│   │   │       └── SecurityPrivacy.jsx
│   │   └── services/
│   │       ├── apiClient.js            # Axios configuration
│   │       ├── auth.js                 # Auth service
│   │       ├── authActions.js          # Auth actions
│   │       ├── authService.js          # Auth utilities
│   │       ├── patientAction.js        # Patient API calls
│   │       ├── doctorAction.js         # Doctor API calls
│   │       ├── adminActions.js         # Admin API calls
│   │       ├── consultationService.js  # Consultation API
│   │       └── socket.js               # Socket.IO setup
│   └── public/                         # Static assets
│
└── README.md                           # This file
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **MongoDB** v5+ ([Setup Guide](https://docs.mongodb.com/manual/installation/))
- **Git** ([Download](https://git-scm.com/))
- **npm** (comes with Node.js)

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/FYP.git
cd FYP
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/telemedicine" > .env
echo "JWT_SECRET=your_jwt_secret_key_here" >> .env
echo "PORT=5000" >> .env

# Verify installation
npm list
```

**Backend .env Example:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/telemedicine
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/telemedicine

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173

# Socket.IO
SOCKET_PORT=5000
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd ../Frontend

# Install dependencies
npm install

# Create .env (if needed)
echo "VITE_API_URL=http://localhost:5000/api" > .env
echo "VITE_SOCKET_URL=http://localhost:5000" >> .env

# Verify installation
npm list
```

**Frontend .env Example:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_ENVIRONMENT=development
```

### Step 4: Database Setup

```bash
# Option A: Local MongoDB
mongod

# Option B: MongoDB Atlas (Cloud)
# Update MONGODB_URI in Backend/.env with your connection string
# mongodb+srv://username:password@cluster.mongodb.net/telemedicine
```

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
# Output: The server is running on the port 5000
# db connected successfully!
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
# Output: VITE v... ready in ... ms
# ➜  Local:   http://localhost:5173/
```

**Access the Application:**
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)

### Production Mode

**Backend:**
```bash
cd Backend
npm start
# Runs on specified PORT (default 5000)
```

**Frontend:**
```bash
cd Frontend
npm run build
npm run preview
# Generates optimized build in dist/
```

### Testing

**Run Login Logging Tests:**
```bash
cd Backend
npm run test:login
# Tests: user registration, login, failed attempts, history, stats
```

---

## 📡 API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "Secure@123",
  "role": "patient",              // or "doctor" or "admin"
  
  // Patient fields
  "age": 30,
  "gender": "male",
  "phone": "+1234567890",
  "medicalHistory": "No known allergies",
  "city": "New York",
  
  // Doctor fields
  "specialty": "Cardiology",
  "qualifications": "MD, FACC",
  "yearsOfExperience": 10,
  "availability": "Mon-Fri 9AM-5PM",
  "chargesPerSession": 50
}

Response: 201 Created
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ...user data }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "john@example.com",   // email or username
  "password": "Secure@123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ...user data }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "user": { ...user data }
}
```

#### Get Login History
```
GET /api/auth/login-history
Authorization: Bearer <token>

Response: 200 OK
{
  "loginHistory": [
    {
      "_id": "...",
      "username": "johndoe",
      "loginTime": "2026-03-17T10:30:00Z",
      "ipAddress": "192.168.1.1",
      "location": { "country": "USA", "city": "New York" },
      "deviceInfo": { "browser": "Chrome", "os": "Windows" },
      "loginStatus": "success"
    }
  ]
}
```

#### Get Login Statistics
```
GET /api/auth/login-stats
Authorization: Bearer <token>

Response: 200 OK
{
  "totalLogins": 25,
  "failedLogins": 2,
  "suspiciousLogins": 1,
  "uniqueDevicesCount": 3,
  "uniqueLocationsCount": 2
}
```

#### Admin: Get All Login Logs
```
GET /api/auth/admin/all-login-logs?limit=50&page=1&userId=user_id
Authorization: Bearer <admin-token>

Response: 200 OK
{
  "loginLogs": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "pages": 3
  }
}
```

#### Admin: Get Suspicious Logins
```
GET /api/auth/admin/suspicious-logins
Authorization: Bearer <admin-token>

Response: 200 OK
{
  "suspiciousLogins": [
    {
      "username": "attacker",
      "ipAddress": "203.0.113.50",
      "location": { "country": "Unknown" },
      "riskFactors": ["new_device_or_location", "unusual_time"]
    }
  ]
}
```

---

### Patient Endpoints

#### Book Appointment
```
POST /api/patient/appointments/book
Authorization: Bearer <token>

{
  "doctorId": "doctor_id",
  "appointmentDate": "2026-03-20",
  "appointmentTime": "10:00 AM",
  "reason": "Regular checkup"
}

Response: 201 Created
```

#### Get My Appointments
```
GET /api/patient/appointments
Authorization: Bearer <token>

Response: 200 OK
```

#### Get Medical Records
```
GET /api/patient/medical-records
Authorization: Bearer <token>

Response: 200 OK
```

#### Get Prescriptions
```
GET /api/patient/prescriptions
Authorization: Bearer <token>

Response: 200 OK
```

#### Submit Feedback
```
POST /api/patient/feedback
Authorization: Bearer <token>

{
  "doctorId": "doctor_id",
  "rating": 5,
  "comment": "Great consultation"
}

Response: 201 Created
```

---

### Doctor Endpoints

#### Get My Appointments
```
GET /api/doctor/appointments
Authorization: Bearer <token>

Response: 200 OK
```

#### Complete Appointment
```
PUT /api/doctor/appointments/:appointmentId/complete
Authorization: Bearer <token>

Response: 200 OK
```

#### Get Patients List
```
GET /api/doctor/patients
Authorization: Bearer <token>

Response: 200 OK
```

#### Create Prescription
```
POST /api/doctor/prescriptions
Authorization: Bearer <token>

{
  "patientId": "patient_id",
  "medications": [
    {
      "name": "Aspirin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "7 days"
    }
  ],
  "notes": "Take with food"
}

Response: 201 Created
```

#### Generate Medical Report
```
POST /api/doctor/reports
Authorization: Bearer <token>

{
  "patientId": "patient_id",
  "diagnosis": "Hypertension",
  "treatment": "Prescribed medication",
  "observations": "Blood pressure elevated"
}

Response: 201 Created
```

---

### Admin Endpoints

#### Get All Users
```
GET /api/admin/all
Authorization: Bearer <admin-token>

Response: 200 OK
```

#### Verify Doctor
```
PUT /api/admin/verification/verify/:userId
Authorization: Bearer <admin-token>

Response: 200 OK
```

#### Get Pending Doctors
```
GET /api/admin/verification/pending-doctors
Authorization: Bearer <admin-token>

Response: 200 OK
```

#### Security & Privacy Endpoints
```
GET /api/admin/security/logs                    # System access logs
GET /api/admin/security/patient-access          # Patient data access control
GET /api/admin/security/consultation-encryption # Encryption status
GET /api/admin/security/retention-policies      # Data retention
GET /api/admin/security/pending-deletions       # Pending deletions
GET /api/admin/security/staff-compliance        # Staff compliance
GET /api/admin/security/patient-consent         # Patient consent
PUT /api/admin/security/approve-deletion/:id    # Approve deletion

Authorization: Bearer <admin-token>
```

#### System Monitoring
```
GET /api/admin/monitoring/statistics   # System stats
GET /api/admin/monitoring/activity     # Recent activity
GET /api/admin/monitoring/feedback     # Latest feedback

Authorization: Bearer <admin-token>
```

#### Analytics
```
GET /api/admin/analytics/top-doctors          # Top performing doctors
GET /api/admin/analytics/kpi-metrics          # KPI metrics
GET /api/admin/analytics/engagement           # Engagement metrics
GET /api/admin/analytics/consultation-trend   # Consultation trends

Authorization: Bearer <admin-token>
```

---

## 🔐 Security Features

### 1. **Authentication & Authorization**
- ✅ JWT-based authentication (7-day expiry)
- ✅ bcryptjs password hashing (salt rounds: 10)
- ✅ Role-based access control (RBAC)
- ✅ Token verification middleware
- ✅ Secure session management

### 2. **Login Activity Tracking**
- ✅ **LoginLog Model** captures every authentication attempt
- ✅ **IP Address Logging** - Real client IP detection
- ✅ **Geolocation Tracking** - Primary API (IP-API.com) + Fallback (geoip.tools)
- ✅ **Device Fingerprinting** - Browser, OS, device type
- ✅ **Anomaly Detection** - Flags suspicious patterns:
  - New device/location access
  - Unusual login times (23:00-06:00)
  - Rapid login attempts (3+ in 10 min)
  - Different country logins
- ✅ **Failed Login Tracking** - All authentication failures logged
- ✅ **Admin Monitoring** - Real-time suspicious login dashboard

### 3. **Data Protection**
- ✅ HTTPS/TLS encryption in transit
- ✅ MongoDB encryption at rest
- ✅ Patient data confidentiality controls
- ✅ GDPR-compliant data retention
- ✅ Right to be forgotten (data deletion)
- ✅ Patient consent management

### 4. **CORS & Network Security**
- ✅ CORS configuration for frontend origin
- ✅ Proxy trust settings for production
- ✅ Request size limits
- ✅ Rate limiting ready

### 5. **Data Validation**
- ✅ Input validation on all endpoints
- ✅ Mongoose schema validation
- ✅ Email format validation
- ✅ Password strength requirements
- ✅ Type checking

### 6. **Compliance**
- ✅ HIPAA-compliant (Healthcare)
- ✅ GDPR-compliant (Data privacy)
- ✅ Patient data encryption
- ✅ Access audit trails
- ✅ Data retention policies
- ✅ Consent management

---

## 🚀 Deployment

### Live Deployment

**Frontend (Vercel):**
- 🌐 **Live URL**: [https://telemedicine-ruby.vercel.app/](https://telemedicine-ruby.vercel.app/)
- Auto-deploys from GitHub on push to `main` branch
- Serverless functions for API requests

**Backend (Render):**
- Deployed on Render for API hosting
- MongoDB Atlas for database
- Auto-scaling with SSL/TLS

### Access Points

| Environment | Frontend | Backend API |
|-------------|----------|-------------|
| **Development** | http://localhost:5173 | http://localhost:5000/api |
| **Production** | https://telemedicine-ruby.vercel.app | https://fyp-ijaz.onrender.com |

### Deployment Steps

**Frontend Deployment (Vercel):**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd Frontend
vercel
```

**Backend Deployment (Render):**
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy automatically or manually

### Configuration

- Environment variables are managed securely in deployment platform dashboards
- No sensitive credentials stored in repository
- Separate configs for development and production environments

---

## 🧪 Testing

### Manual Testing

**1. Register & Login:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName":"John Doe",
    "email":"john@test.com",
    "username":"johndoe",
    "password":"Test@123",
    "role":"patient"
  }'
```

**2. Login Logging Test:**
```bash
npm run test:login
# Runs comprehensive test suite
```

**3. Check Login Logs in MongoDB:**
```javascript
db.loginlogs.find().pretty()
db.loginlogs.countDocuments()
db.loginlogs.find({ loginStatus: "success" })
```

---

## 📝 Contributing

### Steps to Contribute
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Standards
- Use consistent naming conventions
- Add comments for complex logic
- Test before submitting PR
- Follow existing code style

---

## 📞 Support & Contact

- **Issues**: Create an issue on GitHub
- **Email**: afridiijaz520@gmail.com
- **Live Demo**: [https://telemedicine-ruby.vercel.app/](https://telemedicine-ruby.vercel.app/)

---

## 📄 License

This project is licensed under the ISC License - see LICENSE file for details.

---

## 🎉 Acknowledgments

- Healthcare compliance guidance
- Open-source community
- MongoDB & Express.js documentation
- React.js best practices

---

**Last Updated**: March 17, 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready
