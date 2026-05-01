import mongoose from "mongoose";

const clientProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
      index: true,
    },
    companyName: {
      type: String,
      trim: true,
      maxlength: [150, "Company name must be less than 150 characters"],
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
    industry: {
      type: String,
      trim: true,
      default: "",
    },
    companySize: {
      type: String,
      enum: ["solo", "2-10", "11-50", "51-200", "201-1000", "1000+"],
      default: "solo",
    },
    location: {
      country: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      timezone: { type: String, trim: true, default: "" },
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    paymentVerified: {
      type: Boolean,
      default: false,
    },
    jobsPosted: {
      type: Number,
      default: 0,
    },
    activeContracts: {
      type: Number,
      default: 0,
    },
    hireRate: {
      type: Number,
      min: [0, "Hire rate cannot be negative"],
      max: [100, "Hire rate cannot exceed 100"],
      default: 0,
    },
    averageRating: {
      type: Number,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    socialLinks: {
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
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
clientProfileSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

const ClientProfile = mongoose.model("ClientProfile", clientProfileSchema);

export default ClientProfile;
