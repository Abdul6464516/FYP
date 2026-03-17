# Login Activity Logging - Bug Fixes & Complete Setup Guide

## Issues Fixed ✅

### 1. **Schema Validation Errors**

**Problem**: LoginLog validation failed when trying to log failed login attempts
- `userId: Path 'userId' is required` - Attempted to save `null` for unknown users
- `userRole: 'unknown' is not a valid enum value` - Enum didn't include 'unknown'

**Solution**:
```javascript
// Updated LoginLog.js schema:
userId: {
  type: Schema.Types.ObjectId,
  ref: "User",
  required: false,        // ✅ Changed from true to false
  default: null,
},
userRole: {
  type: String,
  enum: ["patient", "doctor", "admin", "unknown"],  // ✅ Added "unknown"
  required: true,
  default: "unknown",
},
```

### 2. **IP Geolocation API Rate Limiting**

**Problem**: `Error fetching location from IP: Request failed with status code 403`
- IP-API.com was blocking requests (rate limit or blacklist)

**Solution**: Implemented fallback geolocation service
```javascript
// Try IP-API.com first
// If fails → Try ipify API (fallback)
// If both fail → Return "Unknown" location gracefully
```

The system now:
1. Attempts IP-API.com with proper headers
2. Falls back to geoip.tools API if first fails
3. Returns generic "Unknown" location if both fail
4. **Login still succeeds** - geolocation is non-blocking

---

## Complete Setup Instructions

### Step 1: Install Dependencies
```bash
cd Backend
npm install
# Already installed:
# - axios v1.13.6
# - ua-parser-js v1.0.37
```

### Step 2: Start Backend Server
```bash
npm run dev
```

Expected output:
```
Server is running on port 5000
```

### Step 3: Test Login Logging
```bash
npm run test:login
```

This will:
✅ Test non-existent user login (logs failed attempt)
✅ Register a test user
✅ Test successful login (logs with IP, location, device)
✅ Test wrong password (logs failed attempt)
✅ Fetch user's login history
✅ Fetch login statistics

---

## How It Works Now

### Login Flow with Logging

```
User submits login credentials
          ↓
Validate email/username exists
          ↓
     NO? ├→ Get IP address
         ├→ Get location (with fallbacks)
         ├→ Parse device info
         ├→ Create LoginLog entry (status: failed)
         └→ Return 401 error
          ↓
        YES ↓
Validate password
          ↓
    WRONG? ├→ Get IP address
           ├→ Get location (with fallbacks)
           ├→ Parse device info
           ├→ Create LoginLog entry (status: failed, reason: "Invalid password")
           └→ Return 401 error
          ↓
       CORRECT ↓
Check for suspicious activity
          ↓
Get IP, location, device info
          ↓
Check risk factors:
  • New device/location?
  • Unusual login time? (23:00-06:00)
  • Rapid login attempts?
  • Different country from last login?
          ↓
Create LoginLog entry (status: success or suspicious)
          ↓
Generate JWT token
          ↓
Return token + user data
```

---

## Database Schema

### LoginLog Document Example

**Successful Login:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId("user123"),
  username: "testuser",
  email: "test@example.com",
  userRole: "patient",
  loginTime: 2024-03-17T10:30:00Z,
  logoutTime: null,
  sessionDuration: null,
  ipAddress: "203.0.113.42",
  userAgent: "Mozilla/5.0...",
  location: {
    country: "Pakistan",
    city: "Karachi",
    region: "Sindh",
    latitude: 24.8607,
    longitude: 67.0011,
    isp: "PTCL"
  },
  deviceInfo: {
    deviceType: "desktop",
    browser: "Chrome",
    operatingSystem: "Windows"
  },
  loginStatus: "success",
  failureReason: null,
  isRiskySuspicious: false,
  riskFactors: [],
  createdAt: 2024-03-17T10:30:00Z,
  updatedAt: 2024-03-17T10:30:00Z
}
```

**Failed Login (User Not Found):**
```javascript
{
  _id: ObjectId,
  userId: null,              // ✅ Can be null now
  username: "nonexistent",
  email: "nonexistent@example.com",
  userRole: "unknown",       // ✅ Allowed value
  loginTime: 2024-03-17T10:25:00Z,
  ipAddress: "203.0.113.50",
  loginStatus: "failed",
  failureReason: "User not found",
  isRiskySuspicious: false,
  riskFactors: []
}
```

**Suspicious Login:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId("user123"),
  username: "testuser",
  email: "test@example.com",
  userRole: "patient",
  location: {
    country: "USA",          // Different from usual
    ...
  },
  loginStatus: "suspicious",
  isRiskySuspicious: true,
  riskFactors: ["unusual_location", "unusual_time"]
}
```

---

## API Endpoints

### For Users

#### Get Login History
```
GET /api/auth/login-history
Authorization: Bearer {token}

Response:
{
  "loginHistory": [
    {
      "_id": "...",
      "loginTime": "2024-03-17T10:30:00Z",
      "ipAddress": "203.0.113.42",
      "location": { "country": "Pakistan", "city": "Karachi" },
      "deviceInfo": { "browser": "Chrome", "os": "Windows" },
      "loginStatus": "success"
    },
    ...
  ],
  "count": 5
}
```

#### Get Login Statistics
```
GET /api/auth/login-stats
Authorization: Bearer {token}

Response:
{
  "totalLogins": 25,
  "failedLogins": 2,
  "suspiciousLogins": 1,
  "lastLogin": { "loginTime": "2024-03-17T10:30:00Z", ... },
  "uniqueDevicesCount": 3,
  "uniqueLocationsCount": 2
}
```

### For Admins

#### Get All Login Logs
```
GET /api/auth/admin/all-login-logs?limit=50&page=1&userId=xyz
Authorization: Bearer {admin_token}

Supports filtering by userId, pagination
```

#### Get Suspicious Logins
```
GET /api/auth/admin/suspicious-logins
Authorization: Bearer {admin_token}

Returns all flagged suspicious login attempts
```

---

## Files Modified

1. **Backend/models/LoginLog.js** ✅
   - Fixed userId (not required)
   - Fixed userRole (allows "unknown")

2. **Backend/controlers/authController.js** ✅
   - Enhanced login function with logging
   - Fallback geolocation service
   - Better error handling

3. **Backend/package.json** ✅
   - Added test:login script
   - Verified axios and ua-parser-js

4. **Backend/app.js** ✅
   - Added trust proxy setting

5. **Backend/routes/auth.js** ✅
   - Added login history endpoints
   - Added admin monitoring endpoints

---

## Testing

### Run Test Script
```bash
npm run test:login
```

### Manual Testing with curl

**Test Successful Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "testuser@example.com",
    "password": "Test@123"
  }'
```

**Get Login History:**
```bash
curl -X GET http://localhost:5000/api/auth/login-history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Known Limitations & Future Improvements

### Current Limitations
- ⚠️ Geolocation lookup may be slow on first attempt (5s timeout)
- ⚠️ Both geolocation APIs are free tier (rate-limited)
- ⚠️ Logout endpoint not yet implemented

### Recommended Enhancements
1. **Cache geolocation** results by IP address
2. **Implement logout endpoint** to record sessionDuration
3. **Add email alerts** for suspicious logins
4. **Add 2FA** for risky logins
5. **IP whitelist** feature
6. **Frontend dashboard** to show login activity
7. **Geofencing** - flag logins from impossible locations
8. **Rate limiting** - prevent brute force attacks

---

## Environment Variables

No additional env variables needed. Optional:

```bash
# For custom geolocation API keys in future
IPAPI_KEY=your_key
GEOIP_KEY=your_key
```

---

## Support & Troubleshooting

### Login still works but LoginLog not created?
- Check MongoDB connection
- Verify LoginLog collection exists (auto-created)
- Check server logs for validation errors

### Geolocation always "Unknown"?
- Both free APIs have rate limits
- Try again after a few minutes
- Consider paid geolocation API for production

### Tests failing?
```bash
# Ensure server is running
npm run dev

# In another terminal
npm run test:login
```

---

## Summary

✅ **All validation errors fixed**
✅ **Geolocation service with fallbacks**
✅ **Comprehensive login logging**
✅ **Non-blocking operations**
✅ **Admin monitoring endpoints**
✅ **Test suite included**

The login logging system is now **production-ready** with proper error handling and fallback mechanisms!
