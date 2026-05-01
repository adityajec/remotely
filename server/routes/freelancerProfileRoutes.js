import express from "express";
import {
  createOrUpdateFreelancerProfile,
  getMyFreelancerProfile,
  getFreelancerProfileById,
} from "../controllers/freelancerProfileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Create / Update freelancer profile (freelancer only)
router.post(
  "/profile",
  authorizeRoles("freelancer"),
  createOrUpdateFreelancerProfile
);

// Get my freelancer profile (freelancer only)
router.get(
  "/profile",
  authorizeRoles("freelancer"),
  getMyFreelancerProfile
);

// Get freelancer profile by user ID (public)
router.get("/profile/:userId", getFreelancerProfileById);

export default router;

