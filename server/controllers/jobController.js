import Job from "../models/Job.js";
import Proposal from "../models/Proposal.js";
import Project from "../models/Project.js";

// @desc    Create a new job (client only)
// @route   POST /api/jobs
// @access  Private (client)
export const createJob = async (req, res) => {
  try {
    const { title, description, requiredSkills, budget, currency, deadline, category, location, experienceLevel } = req.body;

    if (!title || !description || !budget || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description, budget, and deadline",
      });
    }

    const job = await Job.create({
      clientId: req.user._id,
      title: title.trim(),
      description: description.trim(),
      requiredSkills: requiredSkills || [],
      budget: Number(budget),
      currency: currency || "INR",
      deadline: new Date(deadline),
      category: category || "Other",
      location: location || "Remote",
      experienceLevel: experienceLevel || "entry",
    });

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating job",
      error: error.message,
    });
  }
};

// @desc    Get all open jobs (for freelancers to browse)
// @route   GET /api/jobs/open
// @access  Public or Private
export const getAllOpenJobs = async (req, res) => {
  try {
    const { skills, category, location, minBudget, maxBudget, search } = req.query;

    const filter = { status: "open" };

    if (skills) {
      const skillArray = skills.split(",").map((s) => s.trim());
      filter.requiredSkills = { $in: skillArray };
    }

    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: "i" };

    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = Number(minBudget);
      if (maxBudget) filter.budget.$lte = Number(maxBudget);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(filter)
      .populate("clientId", "fullName email")
      .sort({ createdAt: -1 });

    // Count proposals for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const proposalCount = await Proposal.countDocuments({ jobId: job._id });
        return { ...job.toObject(), proposalCount };
      })
    );

    res.status(200).json({
      success: true,
      count: jobsWithCounts.length,
      jobs: jobsWithCounts,
    });
  } catch (error) {
    console.error("Get Open Jobs Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching jobs",
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:jobId
// @access  Public or Private
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate("clientId", "fullName email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const proposalCount = await Proposal.countDocuments({ jobId: job._id });

    res.status(200).json({
      success: true,
      job: { ...job.toObject(), proposalCount },
    });
  } catch (error) {
    console.error("Get Job Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching job",
    });
  }
};

// @desc    Get jobs posted by logged-in client
// @route   GET /api/jobs/my-jobs
// @access  Private (client)
export const getMyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ clientId: req.user._id })
      .populate("clientId", "fullName email")
      .sort({ createdAt: -1 });

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const proposalCount = await Proposal.countDocuments({ jobId: job._id });
        return { ...job.toObject(), proposalCount };
      })
    );

    res.status(200).json({
      success: true,
      count: jobsWithCounts.length,
      jobs: jobsWithCounts,
    });
  } catch (error) {
    console.error("Get My Jobs Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching your jobs",
    });
  }
};

// @desc    Update a job (client only, must be owner)
// @route   PUT /api/jobs/:jobId
// @access  Private (client)
export const updateJob = async (req, res) => {
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
        message: "Not authorized to update this job",
      });
    }

    // Don't allow updates if job is already in progress/completed
    if (job.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "Cannot update job that is already in progress or completed",
      });
    }

    const updates = {};
    const allowedFields = ["title", "description", "requiredSkills", "budget", "currency", "deadline", "category", "location", "experienceLevel"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "deadline") {
          updates[field] = new Date(req.body[field]);
        } else if (field === "budget") {
          updates[field] = Number(req.body[field]);
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating job",
      error: error.message,
    });
  }
};

// @desc    Delete a job (client only, must be owner)
// @route   DELETE /api/jobs/:jobId
// @access  Private (client)
export const deleteJob = async (req, res) => {
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
        message: "Not authorized to delete this job",
      });
    }

    // Don't allow deletion if proposals exist or project started
    const existingProposals = await Proposal.countDocuments({ jobId: job._id });
    const existingProject = await Project.countDocuments({ jobId: job._id });

    if (existingProject > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete job that has an active project",
      });
    }

    // Delete related proposals first
    if (existingProposals > 0) {
      await Proposal.deleteMany({ jobId: job._id });
    }

    await Job.deleteOne({ _id: req.params.jobId });

    res.status(200).json({
      success: true,
      message: `Job deleted successfully. ${existingProposals} proposal(s) also removed.`,
    });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting job",
      error: error.message,
    });
  }
};

