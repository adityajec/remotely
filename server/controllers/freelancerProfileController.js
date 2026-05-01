import FreelancerProfile from "../models/FreelancerProfile.js";

// @desc    Create or update freelancer profile (UPSERT)
// @route   POST /api/freelancer/profile
// @access  Private (freelancer only)
export const createOrUpdateFreelancerProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      title,
      bio,
      avatar,
      skills,
      hourlyRate,
      currency,
      location,
      languages,
      education,
      experience,
      portfolio,
      availability,
      socialLinks,
    } = req.body;

    // Build profile object
    const profileFields = {
      userId,
      ...(title !== undefined && { title }),
      ...(bio !== undefined && { bio }),
      ...(avatar !== undefined && { avatar }),
      ...(skills !== undefined && { skills }),
      ...(hourlyRate !== undefined && { hourlyRate }),
      ...(currency !== undefined && { currency }),
      ...(location !== undefined && { location }),
      ...(languages !== undefined && { languages }),
      ...(education !== undefined && { education }),
      ...(experience !== undefined && { experience }),
      ...(portfolio !== undefined && { portfolio }),
      ...(availability !== undefined && { availability }),
      ...(socialLinks !== undefined && { socialLinks }),
    };

    // Upsert: find and update, or create new
    const profile = await FreelancerProfile.findOneAndUpdate(
      { userId },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Freelancer profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Freelancer Profile Save Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while saving freelancer profile",
      error: error.message,
    });
  }
};

// @desc    Get current freelancer's profile
// @route   GET /api/freelancer/profile
// @access  Private (freelancer only)
export const getMyFreelancerProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await FreelancerProfile.findOne({ userId }).populate(
      "user",
      "fullName email role createdAt"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Freelancer profile not found. Please create one first.",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Freelancer Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching freelancer profile",
      error: error.message,
    });
  }
};

// @desc    Get freelancer profile by user ID (public or admin)
// @route   GET /api/freelancer/profile/:userId
// @access  Public / Admin
export const getFreelancerProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await FreelancerProfile.findOne({ userId }).populate(
      "user",
      "fullName email role createdAt"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Freelancer profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Freelancer Profile By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching freelancer profile",
      error: error.message,
    });
  }
};

