const http = require("http");
const jwt = require("jsonwebtoken");
const seedAdmin = require("./seedAdmin");
require("dotenv").config();

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
            rawBody: data,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            rawBody: data,
          });
        }
      });
    });

    req.on("error", (e) => reject(e));

    if (postData) {
      req.write(typeof postData === "string" ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runExperiment6Tests() {
  console.log("==================================================");
  console.log("EXPERIMENT 6: JWT AUTH & ROLE-BASED AUTHORIZATION");
  console.log("AUTOMATED VERIFICATION TEST SUITE");
  console.log("==================================================\n");

  const timestamp = Date.now();
  const testUser = {
    name: "Regular Student",
    email: `student_${timestamp}@crewboard.com`,
    password: "Password123!",
  };

  const adminCredentials = {
    email: "admin@crewboard.com",
    password: "adminPassword123",
  };

  let userToken = "";
  let adminToken = "";

  // -------------------------------------------------------------------------
  // TEST 1: Register Normal User
  // -------------------------------------------------------------------------
  console.log("--- TEST 1: POST /api/auth/register (New User) ---");
  const res1 = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    testUser
  );
  console.log(`Status: ${res1.statusCode} (Expected: 201)`);
  console.log("Response:", res1.body);
  const pass1 = res1.statusCode === 201 && res1.body?.user?.role === "user";
  console.log(`Result: ${pass1 ? "PASSED" : "FAILED"}\n`);

  // -------------------------------------------------------------------------
  // TEST 2: Attempt Duplicate Registration
  // -------------------------------------------------------------------------
  console.log("--- TEST 2: POST /api/auth/register (Duplicate Email) ---");
  const res2 = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    testUser
  );
  console.log(`Status: ${res2.statusCode} (Expected: 400)`);
  console.log("Response:", res2.body);
  const pass2 = res2.statusCode === 400;
  console.log(`Result: ${pass2 ? "PASSED" : "FAILED"}\n`);

  // -------------------------------------------------------------------------
  // TEST 3: Log In as User and Obtain JWT
  // -------------------------------------------------------------------------
  console.log("--- TEST 3: POST /api/auth/login (User Login) ---");
  const res3 = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: testUser.email, password: testUser.password }
  );
  console.log(`Status: ${res3.statusCode} (Expected: 200)`);
  console.log("Response:", res3.body);
  userToken = res3.body?.token;
  const pass3 = res3.statusCode === 200 && !!userToken;
  console.log(`Result: ${pass3 ? "PASSED" : "FAILED"}\n`);

  // -------------------------------------------------------------------------
  // TEST 4: Access /api/user/dashboard with User Token
  // -------------------------------------------------------------------------
  console.log("--- TEST 4: GET /api/user/dashboard (User Token) ---");
  const res4 = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/user/dashboard",
    method: "GET",
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log(`Status: ${res4.statusCode} (Expected: 200)`);
  console.log("Response:", res4.body);
  const pass4 = res4.statusCode === 200;
  console.log(`Result: ${pass4 ? "PASSED" : "FAILED"}\n`);

  // -------------------------------------------------------------------------
  // TEST 5: Access /api/user/admin with User Token (Expected 403)
  // -------------------------------------------------------------------------
  console.log("--- TEST 5: GET /api/user/admin (User Token -> Forbidden) ---");
  const res5 = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/user/admin",
    method: "GET",
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log(`Status: ${res5.statusCode} (Expected: 403)`);
  console.log("Response:", res5.body);
  const pass5 = res5.statusCode === 403;
  console.log(`Result: ${pass5 ? "PASSED" : "FAILED"}\n`);

  // -------------------------------------------------------------------------
  // TEST 6: Safely Provision/Ensure Admin User via Controlled Seed Method
  // -------------------------------------------------------------------------
  console.log("--- TEST 6: Safe Admin Provisioning (Controlled Seed Method) ---");
  const seeded = await seedAdmin(adminCredentials.email, adminCredentials.password, "Admin User");
  console.log(`Admin Provisioned in Database: ${seeded ? "SUCCESS" : "FAILED"}\n`);

  // -------------------------------------------------------------------------
  // TEST 7: Log In as Seeded Admin
  // -------------------------------------------------------------------------
  console.log("--- TEST 7: POST /api/auth/login (Admin Login) ---");
  const res7 = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    adminCredentials
  );
  console.log(`Status: ${res7.statusCode} (Expected: 200)`);
  console.log("Response:", res7.body);
  adminToken = res7.body?.token;
  const pass7 = res7.statusCode === 200 && res7.body?.user?.role === "admin" && !!adminToken;
  console.log(`Result: ${pass7 ? "PASSED" : "FAILED"}\n`);

  // -------------------------------------------------------------------------
  // TEST 8: Access /api/user/admin with Admin Token (Expected 200)
  // -------------------------------------------------------------------------
  console.log("--- TEST 8: GET /api/user/admin (Admin Token -> Authorized) ---");
  const res8 = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/user/admin",
    method: "GET",
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`Status: ${res8.statusCode} (Expected: 200)`);
  console.log("Response:", res8.body);
  const pass8 = res8.statusCode === 200;
  console.log(`Result: ${pass8 ? "PASSED" : "FAILED"}\n`);

  // -------------------------------------------------------------------------
  // TEST 9: Test Missing, Invalid, and Expired Tokens
  // -------------------------------------------------------------------------
  console.log("--- TEST 9A: GET /api/user/dashboard (No Token) ---");
  const res9A = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/user/dashboard",
    method: "GET",
  });
  console.log(`Status: ${res9A.statusCode} (Expected: 401)`);
  console.log("Response:", res9A.body);
  const pass9A = res9A.statusCode === 401;

  console.log("\n--- TEST 9B: GET /api/user/dashboard (Invalid/Forged Token) ---");
  const res9B = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/user/dashboard",
    method: "GET",
    headers: { Authorization: "Bearer forged_or_garbage_token_value" },
  });
  console.log(`Status: ${res9B.statusCode} (Expected: 401)`);
  console.log("Response:", res9B.body);
  const pass9B = res9B.statusCode === 401;

  console.log("\n--- TEST 9C: GET /api/user/dashboard (Expired Token) ---");
  // Generate an artificially expired token using jsonwebtoken with expiresIn: 0
  const expiredToken = jwt.sign(
    { id: res1.body?.user?._id, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: -10 }
  );
  const res9C = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/user/dashboard",
    method: "GET",
    headers: { Authorization: `Bearer ${expiredToken}` },
  });
  console.log(`Status: ${res9C.statusCode} (Expected: 401)`);
  console.log("Response:", res9C.body);
  const pass9C = res9C.statusCode === 401;

  // -------------------------------------------------------------------------
  // TEST 10: Backward Compatibility check (Tasks & Experiment 5 endpoints)
  // -------------------------------------------------------------------------
  console.log("\n--- BACKWARD COMPATIBILITY: GET /api/tasks ---");
  const resTasks = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/tasks",
    method: "GET",
  });
  console.log(`Status: ${resTasks.statusCode} (Expected: 200)`);
  const passTasks = resTasks.statusCode === 200;

  console.log("\n==================================================");
  const allPassed =
    pass1 &&
    pass2 &&
    pass3 &&
    pass4 &&
    pass5 &&
    seeded &&
    pass7 &&
    pass8 &&
    pass9A &&
    pass9B &&
    pass9C &&
    passTasks;
  console.log(`ALL VERIFICATION TESTS: ${allPassed ? "ALL PASSED (100% SUCCESS)" : "FAILURES DETECTED"}`);
  console.log("==================================================");
}

runExperiment6Tests().catch((err) => console.error("Test execution error:", err));
