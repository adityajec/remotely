import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  createJob,
  getAllOpenJobs,
  getJobById,
  getMyPostedJobs,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

const router = express.Router();

// Public routes
router.get("/open", getAllOpenJobs);
router.get("/:jobId", getJobById);

// Client-only routes
router.post("/", verifyToken, authorizeRoles("client"), createJob);
router.get("/my/jobs", verifyToken, authorizeRoles("client"), getMyPostedJobs);
router.put("/:jobId", verifyToken, authorizeRoles("client"), updateJob);
router.delete("/:jobId", verifyToken, authorizeRoles("client"), deleteJob);

export default router;

