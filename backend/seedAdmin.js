require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

/**
 * Controlled Admin Seed Script
 * Safely creates or promotes an admin user across active database connections
 * (MongoDB Atlas and Local MongoDB fallback) without exposing public registration.
 *
 * Usage:
 *   node seedAdmin.js
 *   node seedAdmin.js <email> <password> <name>
 */
async function seedAdmin(customEmail, customPassword, customName) {
  const adminEmail = (customEmail || process.argv[2] || "admin@crewboard.com").toLowerCase().trim();
  const adminPassword = customPassword || process.argv[3] || "adminPassword123";
  const adminName = customName || process.argv[4] || "Admin User";

  console.log("==================================================");
  console.log("CrewBoard - Controlled Admin Provisioning Script");
  console.log("==================================================");

  // Generate salt and hash once
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  const targets = [];
  if (process.env.MONGO_URI) {
    targets.push({ uri: process.env.MONGO_URI, label: "MongoDB Atlas cluster" });
  }
  targets.push({ uri: "mongodb://127.0.0.1:27017/crewboardDB", label: "Local MongoDB fallback" });

  let successCount = 0;

  for (const target of targets) {
    let conn = null;
    try {
      console.log(`Connecting to ${target.label}...`);
      conn = await mongoose.createConnection(target.uri, {
        serverSelectionTimeoutMS: 4000,
      }).asPromise();

      const TargetUser = conn.model("User", User.schema);
      let user = await TargetUser.findOne({ email: adminEmail });

      if (user) {
        user.name = adminName;
        user.role = "admin";
        user.password = hashedPassword;
        await user.save();
        console.log(`✓ [${target.label}] Existing user updated to ADMIN: ${adminEmail}`);
      } else {
        await TargetUser.create({
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
        });
        console.log(`✓ [${target.label}] New ADMIN user created: ${adminEmail}`);
      }
      successCount++;
    } catch (err) {
      console.warn(`! [${target.label}] Could not provision: ${err.message}`);
    } finally {
      if (conn) {
        await conn.close();
      }
    }
  }

  console.log("==================================================");
  if (successCount > 0) {
    console.log(`Admin provisioning complete! Successfully updated in ${successCount} database(s).`);
  } else {
    console.error("Failed to provision admin in any database. Please check your connections.");
  }
  console.log("==================================================");

  return successCount > 0;
}

if (require.main === module) {
  seedAdmin().catch(console.error);
}

module.exports = seedAdmin;
