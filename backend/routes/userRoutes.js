const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  getAdminData,
  registerUser,
  loginUser,
} = require("../controllers/userController");
const {
  registerValidation,
  loginValidation,
  validate,
} = require("../middleware/validatorMiddleware");
const { authLimiter, testLimiter } = require("../middleware/rateLimiter");

// ==========================================
// EXPERIMENT 6: PROTECTED & ROLE-BASED ROUTES
// ==========================================

/**
 * @desc    User & Admin Dashboard (Accessible to all authenticated users)
 * @route   GET /api/user/dashboard
 * @access  Private (User & Admin)
 */
router.get("/dashboard", protect, (req, res) => {
  res.status(200).json({
    message: `Welcome to the CrewBoard Dashboard, ${req.user.name}!`,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

/**
 * @desc    Admin-Only Route (Accessible strictly to users with role 'admin')
 * @route   GET /api/user/admin
 * @access  Private (Admin only)
 */
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.status(200).json({
    message: `Welcome to the CrewBoard Admin Panel, ${req.user.name}! Authorized admin access granted.`,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// ==========================================
// PREVIOUS EXPERIMENT 5 & FRONTEND COMPATIBILITY
// ==========================================

// User Profile Route
router.get("/profile", protect, getUserProfile);

// Legacy Admin-Only Route
router.get("/admin-only", protect, authorize("admin"), getAdminData);

// Dedicated Rate-Limit Demonstration Route
router.get("/rate-limit-test", testLimiter, (req, res) => {
  res.status(200).json({
    message: "Request allowed. Rate limit window active.",
  });
});

// User Registration Route for legacy /api/users alias
router.post("/register", authLimiter, registerValidation, validate, registerUser);

// User Login Route for legacy /api/users alias
router.post("/login", authLimiter, loginValidation, validate, loginUser);

module.exports = router;
