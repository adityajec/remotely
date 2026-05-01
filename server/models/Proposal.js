import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
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
    proposalText: {
      type: String,
      required: [true, "Proposal text is required"],
      trim: true,
      minlength: [20, "Proposal must be at least 20 characters"],
      maxlength: [5000, "Proposal must be less than 5000 characters"],
    },
    bidAmount: {
      type: Number,
      required: [true, "Bid amount is required"],
      min: [100, "Bid must be at least ₹100"],
    },
    estimatedDays: {
      type: Number,
      required: [true, "Estimated days is required"],
      min: [1, "Minimum 1 day"],
      max: [365, "Maximum 365 days"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate proposals from same freelancer on same job
proposalSchema.index({ jobId: 1, freelancerId: 1 }, { unique: true });
proposalSchema.index({ jobId: 1, status: 1 });
proposalSchema.index({ freelancerId: 1, status: 1 });

const Proposal = mongoose.model("Proposal", proposalSchema);

export default Proposal;

