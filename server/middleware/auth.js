// middleware/auth.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

// Load environment variables
dotenv.config();

// ===================== AUTH MIDDLEWARE =====================
exports.auth = async (req, res, next) => {
  try {
    // Extract token from cookies, body, or Authorization header
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    try {
      // ✅ FIX: use the same secret as in login
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded Token:", decode);

      req.user = decode; // attach user info to request
    } catch (error) {
      console.error("❌ JWT Verification Failed:", error.message);
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// ===================== STUDENT ROLE CHECK =====================
exports.isStudent = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Students",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User Role can't be verified",
    });
  }
};

// ===================== ADMIN ROLE CHECK =====================
exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Admin",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User Role can't be verified",
    });
  }
};

// ===================== INSTRUCTOR ROLE CHECK =====================
exports.isInstructor = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Instructor",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User Role can't be verified",
    });
  }
};
