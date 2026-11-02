require("dotenv").config();
const mongoose = require("mongoose");

async function checkAtlas() {
  console.log("Connecting directly to Atlas MONGO_URI...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Atlas successfully!");

  const users = await mongoose.connection.collection("users").find().toArray();
  console.log("Total users in MongoDB Atlas:", users.length);
  for (const u of users) {
    console.log("--------------------------------------------------");
    console.log("ID:", u._id.toString());
    console.log("Name:", u.name);
    console.log("Email:", u.email);
    console.log("Role:", u.role);
    console.log("Password Hash:", u.password);
    console.log("Created At:", u.createdAt);
  }
  console.log("--------------------------------------------------");
  await mongoose.disconnect();
}

checkAtlas().catch(console.error);
