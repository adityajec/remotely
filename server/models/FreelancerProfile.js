import mongoose from "mongoose";

const freelancerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [150, "Title must be less than 150 characters"],
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [2000, "Bio must be less than 2000 characters"],
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    hourlyRate: {
      type: Number,
      min: [0, "Hourly rate cannot be negative"],
      default: 0,
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "INR"],
      default: "USD",
    },
    location: {
      country: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      timezone: { type: String, trim: true, default: "" },
    },
    languages: [
      {
        language: { type: String, trim: true },
        proficiency: {
          type: String,
          enum: ["basic", "conversational", "fluent", "native"],
          default: "basic",
        },
      },
    ],
    education: [
      {
        institution: { type: String, trim: true },
        degree: { type: String, trim: true },
        fieldOfStudy: { type: String, trim: true },
        startYear: { type: Number },
        endYear: { type: Number },
      },
    ],
    experience: [
      {
        company: { type: String, trim: true },
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        startDate: { type: Date },
        endDate: { type: Date },
        isCurrent: { type: Boolean, default: false },
      },
    ],
    portfolio: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        link: { type: String, trim: true },
        images: [{ type: String }],
      },
    ],
    availability: {
      type: String,
      enum: ["full-time", "part-time", "as-needed", "not-available"],
      default: "as-needed",
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    jobSuccessScore: {
      type: Number,
      min: [0, "Score cannot be negative"],
      max: [100, "Score cannot exceed 100"],
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      website: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to populate user details
freelancerProfileSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

const FreelancerProfile = mongoose.model(
  "FreelancerProfile",
  freelancerProfileSchema
);

export default FreelancerProfile;
