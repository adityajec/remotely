import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  submitProposal,
  getMySubmittedProposals,
  getProposalsForSpecificJob,
  acceptProposalAndCreateProject,
  withdrawProposal,
} from "../controllers/proposalController.js";

const router = express.Router();

// Freelancer routes
router.post("/", verifyToken, authorizeRoles("freelancer"), submitProposal);
router.get("/my/proposals", verifyToken, authorizeRoles("freelancer"), getMySubmittedProposals);
router.put("/:proposalId/withdraw", verifyToken, authorizeRoles("freelancer"), withdrawProposal);

// Client routes
router.get("/job/:jobId", verifyToken, authorizeRoles("client"), getProposalsForSpecificJob);
router.post("/:proposalId/accept", verifyToken, authorizeRoles("client"), acceptProposalAndCreateProject);

export default router;

