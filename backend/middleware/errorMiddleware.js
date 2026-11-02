// 404 Not Found Middleware
const notFound = (req, res, next) => {
  res.status(404).json({
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
};

// Centralized Secure Error Handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : err.statusCode || 500;

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    return res.status(statusCode).json({
      message: "Resource not found with specified identifier format",
    });
  }

  // Handle Mongoose Duplicate Key Error (e.g. unique email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(statusCode).json({
      message: `A record with this ${field} already exists`,
    });
  }

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(statusCode).json({
      message: messages.join(", "),
    });
  }

  // Handle JWT verification errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    return res.status(statusCode).json({
      message: "Invalid or malformed token",
    });
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    return res.status(statusCode).json({
      message: "Token has expired, please log in again",
    });
  }

  // Safe fallback: never expose stack trace, database connection, or secrets
  const safeMessage =
    statusCode === 500
      ? "Internal server error"
      : err.message || "An error occurred";

  res.status(statusCode).json({
    message: safeMessage,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
