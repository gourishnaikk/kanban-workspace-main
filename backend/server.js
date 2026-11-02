require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const { generalLimiter } = require("./middleware/rateLimiter");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// 1. Security Headers via Helmet
app.use(helmet());

// 2. Cross-Origin Resource Sharing (CORS)
app.use(cors());

// 3. Built-in JSON Body Parser
app.use(express.json());

// 4. Rate Limiting across API endpoints
app.use("/api", generalLimiter);

// 5. MongoDB Connection with seamless fallback
const primaryUri = process.env.MONGO_URI;
const localFallbackUri = "mongodb://127.0.0.1:27017/crewboardDB";

mongoose
  .connect(primaryUri, { serverSelectionTimeoutMS: 4000 })
  .then(() => {
    console.log("MongoDB Connected successfully (Atlas cluster)");
  })
  .catch((error) => {
    console.warn("MongoDB Atlas connection warning:", error.message);
    console.log("Connecting to local MongoDB service for seamless offline/development operation...");
    mongoose
      .connect(localFallbackUri)
      .then(() => {
        console.log("Local MongoDB connected successfully (mongodb://127.0.0.1:27017/crewboardDB)");
      })
      .catch((localError) => {
        console.error("Local MongoDB connection error:", localError.message);
      });
  });

// 6. Base Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "CrewBoard Secure RESTful API is Running (Experiment 6)",
  });
});

// 7. Mount Application Routes
app.use("/api/auth", authRoutes);       // Authentication endpoints (Register, Login)
app.use("/api/user", userRoutes);       // User & Admin protected endpoints
app.use("/api/users", userRoutes);      // Preserved alias for frontend & backward compatibility
app.use("/api/tasks", taskRoutes);      // Task management endpoints

// 8. 404 Not Found & Centralized Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// 9. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
