# Login Activity Logging System - Implementation Guide

## Overview
Comprehensive login activity tracking system that logs user login attempts with detailed information including IP address, location, device info, and suspicious activity detection.

---

## 1. **LoginLog Model** (`Backend/models/LoginLog.js`)

### Schema Fields:
```javascript
{
  userId: ObjectId (ref: User),           // User who logged in
  username: String,                        // Username for the login
  email: String,                          // Email used for login
  userRole: String,                       // user, doctor, admin
  loginTime: Date,                        // When login occurred
  logoutTime: Date,                       // When user logged out
  sessionDuration: Number,                // Duration in seconds
  ipAddress: String,                      // IP address of login
  userAgent: String,                      // Browser/device user agent
  
  location: {
    country: String,                      // Country of login
    city: String,                         // City of login
    region: String,                       // Region/State
    latitude: Number,                     // Geo coordinates
    longitude: Number,
    isp: String,                          // Internet Service Provider
  },
  
  deviceInfo: {
    deviceType: String,                   // mobile, tablet, desktop
    browser: String,                      // Browser name
    operatingSystem: String,              // OS name
  },
  
  loginStatus: String,                    // success, failed, suspicious
  failureReason: String,                  // Why login failed
  isRiskySuspicious: Boolean,             // Flag for suspicious activity
  riskFactors: [String],                  // Array of risk factors
}
```

### Suspicious Activity Detection:
- **new_device_or_location** - First login from this IP
- **unusual_location** - Login from different country than previous
- **unusual_time** - Login at odd hours (23:00-06:00)
- **rapid_login_attempts** - Multiple logins within 10 minutes

---

## 2. **Authentication Controller Updates** (`Backend/controlers/authController.js`)

### New Functions:

#### `getLocationFromIP(ipAddress)`
- Calls `https://ip-api.com/json/{ip}` to get location data
- Handles private/localhost IPs gracefully
- Returns: country, city, region, latitude, longitude, ISP
- Timeout: 5 seconds (non-blocking)

#### `parseUserAgent(userAgent)`
- Uses `ua-parser-js` to parse user agent string
- Returns: device type, browser name, operating system

#### `checkSuspiciousActivity(userId, ipAddress, location)`
- Checks against user's login history
- Detects unusual patterns
- Returns array of risk factors

### Login Flow Changes:
1. **User Registration**: Unchanged
2. **User Login**:
   - Validate credentials
   - Get client IP address
   - Get location from IP (via IP-API)
   - Parse device info from user agent
   - Check for suspicious activity
   - Create LoginLog entry (success or failed)
   - Return JWT token on success

---

## 3. **Authentication Routes** (`Backend/routes/auth.js`)

### New Endpoints:

#### User Routes (Requires Authentication):
```
GET /api/auth/login-history
- Get current user's login history (last 50)
- Returns: loginHistory array with login details

GET /api/auth/login-stats
- Get login statistics for current user
- Returns: totalLogins, failedLogins, suspiciousLogins, lastLogin, uniqueDevices, uniqueLocations

POST /api/auth/register
- Register new user

POST /api/auth/login
- Login user and create LoginLog entry

GET /api/auth/me
- Get current user profile
```

#### Admin Routes (Requires Admin Role):
```
GET /api/auth/admin/all-login-logs?limit=100&page=1&userId=xyz
- View all login logs in system
- Supports filtering by userId
- Pagination support

GET /api/auth/admin/suspicious-logins
- Get all suspicious login attempts
- Sorted by date (newest first)
```

---

## 4. **Configuration Changes**

### app.js Updates:
```javascript
app.set('trust proxy', true);  // Trust proxy for accurate client IP
```

This ensures accurate IP address retrieval when behind a proxy/load balancer.

### package.json Updates:
Added dependencies:
```json
{
  "axios": "^1.6.0",
  "ua-parser-js": "^1.0.37"
}
```

Install with:
```bash
npm install axios ua-parser-js
```

---

## 5. **Data Flow Example**

### Successful Login:
```
User submits login → 
Validate credentials →
Get IP: 192.168.1.100 →
Get Location: {"country": "Pakistan", "city": "Karachi", ...} →
Parse Device: {"browser": "Chrome", "os": "Windows", ...} →
Check Risk Factors: [] →
Create LoginLog {
  userId: "123",
  ipAddress: "192.168.1.100",
  location: {...},
  deviceInfo: {...},
  loginStatus: "success",
  riskFactors: []
} →
Return JWT Token
```

### Failed Login (Wrong Password):
```
User submits login →
Validate credentials (FAIL) →
Get IP: 192.168.1.100 →
Get Location: {...} →
Parse Device: {...} →
Create LoginLog {
  userId: "123",
  ipAddress: "192.168.1.100",
  loginStatus: "failed",
  failureReason: "Invalid password"
} →
Return 401 Error
```

### Suspicious Login (New Location):
```
User submits login →
Validate credentials (OK) →
Get Location: {"country": "USA", ...} →
Previous logins from: {"country": "Pakistan"} →
Risk Factors: ["unusual_location"] →
Create LoginLog {
  userId: "123",
  loginStatus: "suspicious",
  isRiskySuspicious: true,
  riskFactors: ["unusual_location"]
} →
Return JWT Token (Login succeeds but flagged)
```

---

## 6. **Database Indexes**

Automatically created for performance:
```javascript
loginLogSchema.index({ userId: 1, loginTime: -1 });     // User login history
loginLogSchema.index({ ipAddress: 1 });                 // IP-based queries
loginLogSchema.index({ loginTime: -1 });                // Recent activity
```

---

## 7. **Security Features**

✅ **IP Tracking** - Logs every login attempt IP address
✅ **Geolocation** - Tracks location of login attempt
✅ **Device Fingerprinting** - Records browser and OS details
✅ **Anomaly Detection** - Flags unusual login patterns
✅ **Failed Login Logging** - Tracks authentication failures
✅ **Admin Monitoring** - Admins can view all login activity
✅ **Session Duration** - Can track logout time when implemented
✅ **Risk Assessment** - Multiple risk factors combined

---

## 8. **Next Steps / Future Enhancements**

### Optional Enhancements:
1. **Logout Endpoint** - Record logout time and calculate session duration
2. **Email Alerts** - Notify user of suspicious logins
3. **Two-Factor Authentication** - Add 2FA for risky logins
4. **IP Whitelist** - Allow users to whitelist trusted IPs
5. **Session Management** - Track active sessions and allow termination
6. **Geofencing** - Set geographic boundaries for logins
7. **Rate Limiting** - Prevent brute force attacks
8. **Login Dashboard** - Frontend UI to show user's login history

---

## 9. **Testing**

### Test Login with Local IP:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@example.com",
    "password": "password123"
  }'
```

### Test Admin Login History:
```bash
curl -X GET http://localhost:5000/api/auth/admin/all-login-logs \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 10. **Error Handling**

- If IP geolocation fails → Uses "Unknown" values (doesn't break login)
- If user agent parsing fails → Uses default values
- If suspicious activity check fails → Still logs login successfully
- Database errors → Logged but don't prevent login

---

## Database Collections

After implementation, you'll have:
- **User** - Existing user records
- **LoginLog** - New collection for login activity (auto-created on first use)

---

## Summary

This implementation provides comprehensive login activity tracking with:
- ✅ 8+ data points per login
- ✅ Geolocation tracking
- ✅ Device fingerprinting
- ✅ Anomaly detection
- ✅ Admin monitoring
- ✅ Failed login tracking
- ✅ Non-blocking IP lookups
- ✅ Automatic database indexing
