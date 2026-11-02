const http = require('http');

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
            rawBody: data
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            rawBody: data
          });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log("==================================================");
  console.log("STARTING EXPERIMENT 5 VERIFICATION TESTS");
  console.log("==================================================\n");

  const timestamp = Date.now();
  const testUser = {
    name: "Student",
    email: `student_${timestamp}@crewboard.com`,
    password: "student123",
    role: "user"
  };

  const adminUser = {
    name: "Admin User",
    email: `admin_${timestamp}@crewboard.com`,
    password: "adminPassword123",
    role: "admin"
  };

  let userToken = "";
  let adminToken = "";

  // Test 1: Register User
  console.log("--- TEST 1: Register User ---");
  const res1 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, testUser);
  console.log(`Status: ${res1.statusCode} (Expected: 201)`);
  console.log(`Response:`, res1.body);
  userToken = res1.body?.token;

  // Test 2: Register Duplicate User
  console.log("\n--- TEST 2: Register Duplicate User ---");
  const res2 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, testUser);
  console.log(`Status: ${res2.statusCode} (Expected: 400)`);
  console.log(`Response:`, res2.body);

  // Test 8: Invalid Registration Data (Testing early for validation)
  console.log("\n--- TEST 8: Invalid Registration Data (Validation Errors) ---");
  const res8 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { name: "", email: "invalid-email", password: "123" });
  console.log(`Status: ${res8.statusCode} (Expected: 400)`);
  console.log(`Response:`, JSON.stringify(res8.body, null, 2));

  // Test 3: Login with Correct Credentials
  console.log("\n--- TEST 3: Login with Correct Credentials ---");
  const res3 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: testUser.email, password: testUser.password });
  console.log(`Status: ${res3.statusCode} (Expected: 200)`);
  console.log(`Response:`, res3.body);
  if (res3.body?.token) userToken = res3.body.token;

  // Test 4: Login with Incorrect Password
  console.log("\n--- TEST 4: Login with Incorrect Password ---");
  const res4 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: testUser.email, password: "wrongPassword" });
  console.log(`Status: ${res4.statusCode} (Expected: 401)`);
  console.log(`Response:`, res4.body);

  // Test 5: Access Profile Without Token
  console.log("\n--- TEST 5: Access Profile Without Token ---");
  const res5 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/profile',
    method: 'GET'
  });
  console.log(`Status: ${res5.statusCode} (Expected: 401)`);
  console.log(`Response:`, res5.body);

  // Test 6: Access Profile with Invalid Token
  console.log("\n--- TEST 6: Access Profile with Invalid Token ---");
  const res6 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/profile',
    method: 'GET',
    headers: { 'Authorization': 'Bearer invalid_or_forged_token_here' }
  });
  console.log(`Status: ${res6.statusCode} (Expected: 401)`);
  console.log(`Response:`, res6.body);

  // Test 7: Access Profile with Valid Token
  console.log("\n--- TEST 7: Access Profile with Valid Token ---");
  const res7 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/profile',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  console.log(`Status: ${res7.statusCode} (Expected: 200)`);
  console.log(`Response:`, res7.body);

  // Test 11: Verify Password is Never Returned
  console.log("\n--- TEST 11: Verify Password is Never Returned ---");
  const hasPasswordInRegister = res1.body?.password !== undefined || res1.body?.user?.password !== undefined;
  const hasPasswordInLogin = res3.body?.password !== undefined || res3.body?.user?.password !== undefined;
  const hasPasswordInProfile = res7.body?.password !== undefined;
  console.log(`Password in register response? ${hasPasswordInRegister}`);
  console.log(`Password in login response? ${hasPasswordInLogin}`);
  console.log(`Password in profile response? ${hasPasswordInProfile}`);
  console.log(`VERDICT: ${(!hasPasswordInRegister && !hasPasswordInLogin && !hasPasswordInProfile) ? 'PASSED (Password is never exposed)' : 'FAILED'}`);

  // Register Admin user for Test 12
  console.log("\n--- Registering Admin User for Authorization Test ---");
  const resAdminReg = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, adminUser);
  adminToken = resAdminReg.body?.token;
  console.log(`Admin created: ${resAdminReg.body?.user?.name} (Role: ${resAdminReg.body?.user?.role})`);

  // Test 12: Verify Normal User Cannot Access Admin Functionality
  console.log("\n--- TEST 12A: Regular User Trying to Access Admin-Only Route ---");
  const res12A = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/admin-only',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  console.log(`Status: ${res12A.statusCode} (Expected: 403 Forbidden)`);
  console.log(`Response:`, res12A.body);

  console.log("\n--- TEST 12B: Admin User Accessing Admin-Only Route ---");
  const res12B = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/admin-only',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`Status: ${res12B.statusCode} (Expected: 200 OK)`);
  console.log(`Response:`, res12B.body);

  // Test 9: Rapid requests to demonstrate Rate Limiting
  console.log("\n--- TEST 9: Rate Limiting Demonstration ---");
  console.log("Sending 6 rapid requests to /api/users/rate-limit-test...");
  for (let i = 1; i <= 6; i++) {
    const resRate = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/users/rate-limit-test',
      method: 'GET'
    });
    console.log(`Request #${i}: Status ${resRate.statusCode} - ${JSON.stringify(resRate.body)}`);
  }

  // Test 10: Verify Password is Hashed in MongoDB
  console.log("\n--- TEST 10: Verify Password is Hashed in MongoDB Database ---");
  const mongoose = require('mongoose');
  require('dotenv').config();
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 4000 });
  } catch (err) {
    await mongoose.connect('mongodb://127.0.0.1:27017/crewboardDB');
  }
  const User = require('./models/User');
  const dbUser = await User.findOne({ email: testUser.email });
  console.log("Raw user document in MongoDB:");
  console.log(`_id: ${dbUser._id}`);
  console.log(`name: ${dbUser.name}`);
  console.log(`email: ${dbUser.email}`);
  console.log(`password hash in DB: ${dbUser.password}`);
  const isBcryptHash = dbUser.password.startsWith('$2a$') || dbUser.password.startsWith('$2b$');
  console.log(`Password is bcrypt hash? ${isBcryptHash}`);
  console.log(`Password matches plaintext 'student123'? ${dbUser.password !== 'student123'}`);
  console.log(`VERDICT: ${(isBcryptHash && dbUser.password !== 'student123') ? 'PASSED (Password securely hashed with bcryptjs)' : 'FAILED'}`);
  await mongoose.disconnect();

  // Test Existing Task APIs (Requirement: DO NOT break previous functionality)
  console.log("\n--- TEST EXISTING TASK API (Backward Compatibility) ---");
  const resTask = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/tasks',
    method: 'GET'
  });
  console.log(`GET /api/tasks Status: ${resTask.statusCode} (Expected: 200)`);
  console.log(`Returned tasks count: ${Array.isArray(resTask.body) ? resTask.body.length : 'non-array'}`);

  console.log("\n==================================================");
  console.log("ALL EXPERIMENT 5 TESTS COMPLETED");
  console.log("==================================================");
}

runTests().catch(err => console.error("Test execution failed:", err));
