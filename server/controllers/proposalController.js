import Proposal from "../models/Proposal.js";
import Job from "../models/Job.js";
import Project from "../models/Project.js";

// @desc    Submit a proposal for a job (freelancer only)
// @route   POST /api/proposals
// @access  Private (freelancer)
export const submitProposal = async (req, res) => {
  try {
    const { jobId, proposalText, bidAmount, estimatedDays, aiGenerated } = req.body;

    if (!jobId || !proposalText || !bidAmount || !estimatedDays) {
      return res.status(400).json({
        success: false,
        message: "Please provide jobId, proposalText, bidAmount, and estimatedDays",
      });
    }

    // Verify job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "Cannot submit proposal for a job that is not open",
      });
    }

    // Prevent client from proposing on their own job
    if (job.clientId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot submit a proposal on your own job",
      });
    }

    const proposal = await Proposal.create({
      jobId,
      freelancerId: req.user._id,
      proposalText: proposalText.trim(),
      bidAmount: Number(bidAmount),
      estimatedDays: Number(estimatedDays),
      aiGenerated: aiGenerated || false,
    });

    const populatedProposal = await Proposal.findById(proposal._id)
      .populate("jobId", "title budget deadline")
      .populate("freelancerId", "fullName email");

    res.status(201).json({
      success: true,
      message: "Proposal submitted successfully",
      proposal: populatedProposal,
    });
  } catch (error) {
    // Handle duplicate proposal error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted a proposal for this job",
      });
    }

    console.error("Submit Proposal Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while submitting proposal",
      error: error.message,
    });
  }
};

// @desc    Get proposals submitted by logged-in freelancer
// @route   GET /api/proposals/my-proposals
// @access  Private (freelancer)
export const getMySubmittedProposals = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { freelancerId: req.user._id };

    if (status) filter.status = status;

    const proposals = await Proposal.find(filter)
      .populate("jobId", "title description budget deadline status clientId")
      .populate("jobId.clientId", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: proposals.length,
      proposals,
    });
  } catch (error) {
    console.error("Get My Proposals Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching proposals",
    });
  }
};

// @desc    Get all proposals for a specific job (client only, must be job owner)
// @route   GET /api/proposals/job/:jobId
// @access  Private (client)
export const getProposalsForSpecificJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view proposals for this job",
      });
    }

    const proposals = await Proposal.find({ jobId: req.params.jobId })
      .populate("freelancerId", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: proposals.length,
      proposals,
    });
  } catch (error) {
    console.error("Get Job Proposals Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching proposals",
    });
  }
};

// @desc    Accept a proposal and create a project (client only)
// @route   POST /api/proposals/:proposalId/accept
// @access  Private (client)
export const acceptProposalAndCreateProject = async (req, res) => {
  try {
    const { milestoneDetails } = req.body; // optional array of milestones

    const proposal = await Proposal.findById(req.params.proposalId)
      .populate("jobId", "clientId title status budget");

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    // Verify the logged-in user is the client who posted the job
    if (proposal.jobId.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to accept this proposal",
      });
    }

    if (proposal.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Proposal is already ${proposal.status}`,
      });
    }

    if (proposal.jobId.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "Job is no longer open for proposals",
      });
    }

    // Update proposal status to accepted
    proposal.status = "accepted";
    await proposal.save();

    // Reject all other proposals for this job
    await Proposal.updateMany(
      { jobId: proposal.jobId._id, _id: { $ne: proposal._id } },
      { status: "rejected" }
    );

    // Create project
    const projectData = {
      jobId: proposal.jobId._id,
      freelancerId: proposal.freelancerId,
      clientId: req.user._id,
      acceptedProposalId: proposal._id,
      agreedAmount: proposal.bidAmount,
      progressStatus: "not-started",
      paymentStatus: "pending",
    };

    // Add milestones if provided
    if (milestoneDetails && Array.isArray(milestoneDetails) && milestoneDetails.length > 0) {
      projectData.milestones = milestoneDetails.map((m) => ({
        title: m.title,
        description: m.description || "",
        amount: Number(m.amount),
        dueDate: m.dueDate ? new Date(m.dueDate) : undefined,
      }));
    }

    const project = await Project.create(projectData);

    // Update job status
    await Job.findByIdAndUpdate(proposal.jobId._id, { status: "in-progress" });

    const populatedProject = await Project.findById(project._id)
      .populate("jobId", "title")
      .populate("freelancerId", "fullName email")
      .populate("clientId", "fullName email")
      .populate("acceptedProposalId", "proposalText bidAmount estimatedDays");

    res.status(201).json({
      success: true,
      message: "Proposal accepted and project created successfully",
      project: populatedProject,
      proposal,
    });
  } catch (error) {
    console.error("Accept Proposal Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while accepting proposal",
      error: error.message,
    });
  }
};

// @desc    Withdraw a proposal (freelancer only)
// @route   PUT /api/proposals/:proposalId/withdraw
// @access  Private (freelancer)
export const withdrawProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.proposalId);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    if (proposal.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to withdraw this proposal",
      });
    }

    if (proposal.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw a ${proposal.status} proposal`,
      });
    }

    proposal.status = "withdrawn";
    await proposal.save();

    res.status(200).json({
      success: true,
      message: "Proposal withdrawn successfully",
      proposal,
    });
  } catch (error) {
    console.error("Withdraw Proposal Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while withdrawing proposal",
      error: error.message,
    });
  }
};

