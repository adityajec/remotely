import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client ID is required"],
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [200, "Title must be less than 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
    },
    requiredSkills: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 20;
        },
        message: "Cannot have more than 20 skills",
      },
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [100, "Budget must be at least ₹100"],
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD", "EUR"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "cancelled"],
      default: "open",
    },
    category: {
      type: String,
      trim: true,
      default: "Other",
    },
    location: {
      type: String,
      trim: true,
      default: "Remote",
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "intermediate", "expert"],
      default: "entry",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ clientId: 1, status: 1 });
jobSchema.index({ requiredSkills: 1 });

const Job = mongoose.model("Job", jobSchema);

export default Job;

