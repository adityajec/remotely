import jwt from "jsonwebtoken";
import User from "../models/User.js";

// @desc    Verify JWT token from Authorization header
// @access  Protected routes
export const verifyToken = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password)
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found. Token is invalid.",
        });
      }

      req.user = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token is invalid or expired.",
      });
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};

