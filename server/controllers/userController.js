const User = require("../models/User");
const { normalizeEmail, isValidEmail } = require("../utils/email");
const fs = require("fs");
const path = require("path");
const {
  verifyGithubProject,
} = require("../utils/githubVerification");
const githubAccountIds = (user) => [...new Set(
  [user.oauthIdentity, ...[user.githubIdentity].flat()]
    .filter((identity) => /^github:\d+$/.test(identity || ""))
    .map((identity) => identity.slice(7))
)];

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email role skills github leetcode experienceYears communicationRating " +
      "availabilityHours projectsCount projects resumeUrl resumeFileName createdAt updatedAt " +
      "githubIdentity oauthIdentity githubAccountNames"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const profile = user.toObject();
    delete profile.githubIdentity;
    delete profile.oauthIdentity;
    delete profile.githubAccountNames;
    res.json({
      success: true,
      user: { ...profile, githubAccounts: githubAccountIds(user).map((id) => ({
        id, login: user.githubAccountNames?.get(id),
      })) },
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
      const normalizedEmail = normalizeEmail(email);
      if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({ success: false, message: "Enter a valid email address." });
      }

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
  if (!Array.isArray(projects)) return res.status(400).json({ message: "Projects must be a list." });
  user.projects = projects.map(({ _id, name, description, technologies, githubUrl, liveUrl }) => {
    const existing = _id && user.projects.id(_id);
    const sameClaim = existing && existing.name === name && existing.description === description &&
      existing.githubUrl === githubUrl && JSON.stringify(existing.technologies) === JSON.stringify(technologies);
    return {
      ...(existing && { _id: existing._id }),
      name, description, technologies, githubUrl, liveUrl,
      ...(sameClaim && { verification: existing.verification }),
    };
  });
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
const verifyProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const user = await User.findById(req.user.id).select("+githubIdentity +oauthIdentity");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const project = user.projects.id(
      projectId
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    if (!project.githubUrl) {
      return res.status(400).json({
        success: false,
        message:
          "Add a GitHub repository before verification.",
      });
    }

    const accountIds = githubAccountIds(user);
    const selectedAccount = req.body?.githubAccountId;
    if (selectedAccount !== undefined && !accountIds.includes(selectedAccount)) {
      return res.status(400).json({ success: false, message: "Choose a GitHub account connected to your profile." });
    }

    const verification =
      await verifyGithubProject({
        githubUrl: project.githubUrl,
        technologies:
          project.technologies || [],
        projectName:project.name,
        projectDescription: project.description,
        candidateId: selectedAccount ?? accountIds[0],
      });

   // If GitHub itself could not be reached, do not save this
// temporary API failure as the student's verification result.
if (verification.status === "Unable to Verify") {
  return res.status(503).json({
    success: false,
    message: verification.error?.message ||
      "GitHub verification is temporarily unavailable.",
    verification,
  });
}

const saved = await User.updateOne({
  _id: user._id,
  projects: { $elemMatch: {
    _id: project._id,
    githubUrl: project.githubUrl,
    name: project.name,
    description: project.description,
    technologies: project.technologies,
  } },
}, { $set: { "projects.$.verification": verification } });
if (!saved.matchedCount) {
  return res.status(409).json({ success: false, message: "Project changed during verification. Run the check again." });
}

return res.status(200).json({
  success: true,
  message:
    verification.status === "Verified"
      ? "Project verified successfully."
      : "Project verification completed. The project did not meet all verification checks.",
  verification,
});

  } catch (error) {
    console.error(
      "Project verification error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to verify project.",
    });
  }
};
module.exports = {
  getProfile,
  updateProfile,
  searchDevelopers,
  getDeveloperById,
  uploadResume,
  verifyProject,
};
