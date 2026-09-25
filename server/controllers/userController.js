const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get profile.",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
  name,
  email,
  skills,
  github,
  leetcode,
  experienceYears,
  communicationRating,
  availabilityHours,
  projectsCount,
  projects,
} = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (email !== undefined) {
      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use.",
        });
      }

      user.email = normalizedEmail;
    }

    if (skills !== undefined) {
      user.skills = skills;
    }

    if (github !== undefined) {
      user.github = github;
    }

    if (leetcode !== undefined) {
      user.leetcode = leetcode;
    }
    if (experienceYears !== undefined) {
  user.experienceYears = Number(experienceYears);
}

if (communicationRating !== undefined) {
  user.communicationRating = Number(
    communicationRating
  );
}

if (availabilityHours !== undefined) {
  user.availabilityHours = Number(
    availabilityHours
  );
}

if (projectsCount !== undefined) {
  user.projectsCount = Number(projectsCount);
}
if (projects !== undefined) {
  user.projects = projects;
}
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully.",
  user: {
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  skills: user.skills,
  github: user.github,
  leetcode: user.leetcode,
  experienceYears: user.experienceYears,
  communicationRating: user.communicationRating,
  availabilityHours: user.availabilityHours,
  projectsCount: user.projectsCount,
  projects: user.projects,
},
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};
const searchDevelopers = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {
      role: "student",
    };

    // Search by name, email, or skill
    if (search && search.trim()) {
      const searchRegex = new RegExp(
        search.trim(),
        "i"
      );

      query = {
        role: "student",
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { skills: searchRegex },
        ],
      };
    }

    const developers = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: developers.length,
      developers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getDeveloperById = async (req, res) => {
  try {
    const developer = await User.findOne({
      _id: req.params.id,
      role: "student",
    }).select("-password");

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: "Developer not found",
      });
    }

    res.json({
      success: true,
      developer,
    });
  } catch (error) {
    console.error("Get developer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch developer",
    });
  }
};
const uploadResume = async (req, res) => {
  try {
  
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a PDF resume.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Delete previous resume if one exists
    if (user.resumeUrl) {
      const oldFileName = path.basename(
        user.resumeUrl
      );

      const oldFilePath = path.join(
        __dirname,
        "../uploads/resumes",
        oldFileName
      );

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    user.resumeUrl =
      `/uploads/resumes/${req.file.filename}`;

    user.resumeFileName =
      req.file.originalname;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully.",
      resumeUrl: user.resumeUrl,
      resumeFileName: user.resumeFileName,
    });
  } catch (error) {
    console.error(
      "Resume upload error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to upload resume.",
    });
  }
};
module.exports = {
  getProfile,
  updateProfile,
  searchDevelopers,
  getDeveloperById,
  uploadResume,
};