import ClientProfile from "../models/ClientProfile.js";

// @desc    Create or update client profile (UPSERT)
// @route   POST /api/client/profile
// @access  Private (client only)
export const createOrUpdateClientProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      companyName,
      bio,
      avatar,
      industry,
      companySize,
      location,
      website,
      preferredSkills,
      socialLinks,
    } = req.body;

    // Build profile object
    const profileFields = {
      userId,
      ...(companyName !== undefined && { companyName }),
      ...(bio !== undefined && { bio }),
      ...(avatar !== undefined && { avatar }),
      ...(industry !== undefined && { industry }),
      ...(companySize !== undefined && { companySize }),
      ...(location !== undefined && { location }),
      ...(website !== undefined && { website }),
      ...(preferredSkills !== undefined && { preferredSkills }),
      ...(socialLinks !== undefined && { socialLinks }),
    };

    // Upsert: find and update, or create new
    const profile = await ClientProfile.findOneAndUpdate(
      { userId },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Client profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Client Profile Save Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while saving client profile",
      error: error.message,
    });
  }
};

// @desc    Get current client's profile
// @route   GET /api/client/profile
// @access  Private (client only)
export const getMyClientProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await ClientProfile.findOne({ userId }).populate(
      "user",
      "fullName email role createdAt"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Client profile not found. Please create one first.",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Client Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching client profile",
      error: error.message,
    });
  }
};

// @desc    Get client profile by user ID (public or admin)
// @route   GET /api/client/profile/:userId
// @access  Public / Admin
export const getClientProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await ClientProfile.findOne({ userId }).populate(
      "user",
      "fullName email role createdAt"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Client profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Client Profile By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching client profile",
      error: error.message,
    });
  }
};

