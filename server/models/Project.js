import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "submitted", "approved", "paid"],
    default: "pending",
  },
  dueDate: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
});

const projectSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID is required"],
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Freelancer ID is required"],
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client ID is required"],
    },
    acceptedProposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      required: [true, "Accepted proposal ID is required"],
    },
    agreedAmount: {
      type: Number,
      required: [true, "Agreed amount is required"],
    },
    progressStatus: {
      type: String,
      enum: ["not-started", "in-progress", "under-review", "completed", "cancelled"],
      default: "not-started",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "in-escrow", "released", "disputed"],
      default: "pending",
    },
    milestones: {
      type: [milestoneSchema],
      default: [],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    completedDate: {
      type: Date,
    },
    freelancerRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    clientRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    freelancerReview: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    clientReview: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ freelancerId: 1, progressStatus: 1 });
projectSchema.index({ clientId: 1, progressStatus: 1 });
projectSchema.index({ jobId: 1 }, { unique: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;

