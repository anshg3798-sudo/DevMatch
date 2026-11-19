const Application = require("../models/Application");
const Project = require("../models/Project");
const User = require("../models/User");
const {
  calculateMatchingScore,
} = require("../utils/matchingEngine");
const applyToProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const studentId = req.user.id;

    // Find project
    const project = await Project.findById(
      projectId
    ).populate(
      "createdBy",
      "name email"
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Don't allow applications to closed projects
    if (project.status === "closed") {
      return res.status(400).json({
        success: false,
        message:
          "This project is no longer accepting applications.",
      });
    }

    // Find student
    const student = await User.findById(
      studentId
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // Prevent duplicate applications
    const existingApplication =
      await Application.findOne({
        project: projectId,
        student: studentId,
      });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message:
          "You have already applied to this project.",
      });
    }

    // Calculate compatibility
    const compatibility =
      calculateMatchingScore({
        developer: student,
        project,
      });

    // Create application
    const application =
      await Application.create({
        project: projectId,
        student: studentId,
        status: "Pending",

        compatibilityScore:
          compatibility.score,

        compatibilityBreakdown:
          compatibility.breakdown,

          matchingWeightsUsed: compatibility.weights,

        matchedSkills:
          compatibility.matchedSkills,

        missingSkills:
          compatibility.missingSkills,
      });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
      compatibility,
    });
  } catch (error) {
    console.error(
      "Apply to project error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to apply to project.",
    });
  }
};

// Recruiter: recalculate all applicant scores for a project
const recalculateProjectScores = async (req, res) => {
  try {
    const { projectId } = req.params;

    // 1. Find project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // 2. Verify project ownership
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this project.",
      });
    }

    // 3. Fetch all applications and required developer data
    const applications = await Application.find({
      project: projectId,
    }).populate(
      "student",
      "name email skills experienceYears communicationRating availabilityHours projectsCount projects"
    );

    if (applications.length === 0) {
      return res.status(200).json({
        success: true,
        message: "There are no applications to recalculate.",
        updatedCount: 0,
      });
    }

    let updatedCount = 0;
    let skippedCount = 0;

    // 4. Recalculate every application's score
    for (const application of applications) {
      const developer = application.student;

      // Skip applications whose student account no longer exists
      if (!developer) {
        skippedCount++;
        continue;
      }

      const compatibility = calculateMatchingScore({
        developer,
        project,
      });

      // 5. Update stored compatibility data
      application.compatibilityScore = compatibility.score;

      application.compatibilityBreakdown =
        compatibility.breakdown;

application.matchingWeightsUsed =
  compatibility.weights;

application.matchedSkills =
  compatibility.matchedSkills;

application.missingSkills =
  compatibility.missingSkills;

await application.save();

      updatedCount++;
    }

    return res.status(200).json({
      success: true,
      message: "Applicant scores recalculated successfully.",
      updatedCount,
      skippedCount,
    });

  } catch (error) {
    console.error("Recalculate scores error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to recalculate applicant scores.",
    });
  }
};

const getApplicants = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Check ownership
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view applicants.",
      });
    }

    // Find all applications
    const applications = await Application.find({
      project: projectId,
    })
    .populate(
  "student",
  `
    name
    email
    skills
    github
    leetcode
    experienceYears
    availabilityHours
    communicationRating
    projects
    resumeUrl
    resumeFileName
    projectsCount
  `
)
      
      .sort({ 
        compatibilityScore: -1,
        createdAt: -1,
        });
     const applicantsWithExplanation = applications.map((application) => {

    return {
        ...application.toObject(),

        explanation: {
            breakdown: application.compatibilityBreakdown,
            matchedSkills: application.matchedSkills,
            missingSkills: application.missingSkills,
        },
    };

});

res.status(200).json({
    success: true,
    count: applicantsWithExplanation.length,
    applications: applicantsWithExplanation,
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getMyApplications = async (req, res) => {
  try {
    const studentId = req.user.id;

    const applications = await Application.find({
      student: studentId,
    })
      .populate(
        "project",
        "title description requiredSkills createdBy"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateApplicationStatus = async (req, res) => {
    try {

        const { applicationId } = req.params;
        const { status } = req.body;

        if (!["Accepted", "Rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status."
            });
        }

        const application = await Application.findById(applicationId)
            .populate("project");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found."
            });
        }

        // Only the recruiter who created the project can update it
        if (
            application.project.createdBy.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized."
            });
        }

        application.status = status;

        await application.save();

        res.status(200).json({
            success: true,
            message: `Application ${status.toLowerCase()} successfully.`,
            application,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(
      applicationId
    ).populate(
      "student",
      `
        name
        email
        skills
        github
        leetcode
        experienceYears
        availabilityHours
        communicationRating
        projectsCount
        resumeUrl
        resumeFileName
        projects
      `
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // Get the project
    const project = await Project.findById(
      application.project
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Only project owner can review application
    if (
      project.createdBy.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this application.",
      });
    }

    res.status(200).json({
      success: true,
      application,
    });

  } catch (error) {
    console.error(
      "Get application by ID error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load application.",
    });
  }
};
module.exports = {
  applyToProject,getApplicants,getMyApplications,updateApplicationStatus,getApplicationById,recalculateProjectScores,
};