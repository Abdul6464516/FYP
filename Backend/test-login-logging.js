#!/usr/bin/env node

/**
 * Test script for Login Activity Logging
 * Run: npm run test:login
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test user credentials
const testUser = {
  email: 'testuser@example.com',
  password: 'Test@123',
  username: 'testuser'
};

async function testLoginLogging() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  LOGIN ACTIVITY LOGGING - TEST SCRIPT');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    // Test 1: Try login with non-existent user
    console.log('📝 Test 1: Attempting login with non-existent user...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        identifier: 'nonexistent@example.com',
        password: 'wrongpassword'
      });
    } catch (err) {
      if (err.response?.status === 401) {
        console.log('✅ Non-existent user login rejected (as expected)\n');
      }
    }

    // Test 2: Register a test user
    console.log('📝 Test 2: Registering test user...');
    try {
      const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
        fullName: 'Test User',
        email: testUser.email,
        username: testUser.username,
        password: testUser.password,
        role: 'patient',
        city: 'Test City'
      });
      console.log('✅ User registered successfully');
      console.log(`   User ID: ${registerRes.data.user._id}\n`);
    } catch (err) {
      if (err.response?.status === 409) {
        console.log('⚠️  User already exists (continuing with existing user)\n');
      } else {
        throw err;
      }
    }

    // Test 3: Successful login
    console.log('📝 Test 3: Attempting successful login...');
    let token;
    try {
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        identifier: testUser.email,
        password: testUser.password
      });
      token = loginRes.data.token;
      console.log('✅ Login successful');
      console.log(`   Token: ${token.substring(0, 20)}...\n`);
    } catch (err) {
      console.log('❌ Login failed:', err.response?.data?.message);
      return;
    }

    // Test 4: Failed login (wrong password)
    console.log('📝 Test 4: Attempting login with wrong password...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        identifier: testUser.email,
        password: 'wrongpassword'
      });
    } catch (err) {
      if (err.response?.status === 401) {
        console.log('✅ Wrong password rejected (as expected)\n');
      }
    }

    // Test 5: View login history
    if (token) {
      console.log('📝 Test 5: Fetching user login history...');
      try {
        const historyRes = await axios.get(`${BASE_URL}/auth/login-history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Retrieved ${historyRes.data.count} login records`);
        console.log('\n   Recent logins:');
        historyRes.data.loginHistory.slice(0, 3).forEach((log, i) => {
          console.log(`   ${i + 1}. ${log.loginStatus.toUpperCase()} - ${log.loginTime} from ${log.ipAddress}`);
        });
        console.log();
      } catch (err) {
        console.log('❌ Failed to fetch login history:', err.response?.data?.message);
      }

      // Test 6: View login stats
      console.log('📝 Test 6: Fetching login statistics...');
      try {
        const statsRes = await axios.get(`${BASE_URL}/auth/login-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Login Statistics:');
        console.log(`   Total successful logins: ${statsRes.data.totalLogins}`);
        console.log(`   Failed login attempts: ${statsRes.data.failedLogins}`);
        console.log(`   Suspicious logins: ${statsRes.data.suspiciousLogins}`);
        console.log(`   Unique devices: ${statsRes.data.uniqueDevicesCount}`);
        console.log(`   Unique locations: ${statsRes.data.uniqueLocationsCount}`);
        if (statsRes.data.lastLogin) {
          console.log(`   Last login: ${statsRes.data.lastLogin.loginTime}`);
        }
        console.log();
      } catch (err) {
        console.log('❌ Failed to fetch login stats:', err.response?.data?.message);
      }
    }

    console.log('═══════════════════════════════════════════════════');
    console.log('  ✅ All tests completed!');
    console.log('═══════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response?.data) {
      console.error('   Response:', error.response.data);
    }
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/auth/me`, { 
      headers: { Authorization: 'Bearer test' },
      validateStatus: () => true 
    });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error('❌ Backend server is not running!');
    console.error('   Start the server with: npm run dev');
    process.exit(1);
  }

  await testLoginLogging();
}

main();
