import express from "express";
import {
  createOrUpdateClientProfile,
  getMyClientProfile,
  getClientProfileById,
} from "../controllers/clientProfileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Create / Update client profile (client only)
router.post(
  "/profile",
  authorizeRoles("client"),
  createOrUpdateClientProfile
);

// Get my client profile (client only)
router.get(
  "/profile",
  authorizeRoles("client"),
  getMyClientProfile
);

// Get client profile by user ID (public)
router.get("/profile/:userId", getClientProfileById);

export default router;

