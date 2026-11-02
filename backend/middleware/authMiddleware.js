const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * JWT Authentication Middleware
 * Verifies Bearer token in Authorization header and attaches user to req.user
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check for Authorization header starting with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided",
      });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    if (!token || token.trim() === "") {
      return res.status(401).json({
        message: "Access denied. No token provided",
      });
    }

    try {
      // Verify JWT using secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user document (excluding password) to req.user
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          message: "User not found or account no longer exists",
        });
      }

      req.user = user;
      return next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token has expired, please log in again",
        });
      }
      return res.status(401).json({
        message: "Invalid or malformed token",
      });
    }
  } catch (error) {
    return next(error);
  }
};

/**
 * Role-Based Authorization Middleware
 * Verifies if the authenticated user has one of the required roles
 * @param  {...string} roles - Permitted roles (e.g., 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Access denied. Authentication required.",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Forbidden: Access restricted. Role '${req.user.role}' is not authorized to access this resource.`,
        });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

module.exports = {
  protect,
  authorize,
  authorizeRoles: authorize, // Backward-compatibility alias
};
