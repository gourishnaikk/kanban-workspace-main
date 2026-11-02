const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper to generate signed JWT with id, role, and expiration
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Create user (password is automatically hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: role && ["user", "admin"].includes(role) ? role : "user",
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Compare password using bcrypt
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private (JWT protected)
const getUserProfile = async (req, res, next) => {
  try {
    // req.user is set by authMiddleware protect (password excluded)
    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin-only administrative operations
// @route   GET /api/users/admin-only
// @access  Private (Admin role required)
const getAdminData = async (req, res, next) => {
  try {
    res.status(200).json({
      message: "Admin authorization verified. Access granted to administrative console.",
      systemStatus: "Operational",
      adminUser: {
        _id: req.user._id,
        name: req.user.name,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getAdminData,
};
