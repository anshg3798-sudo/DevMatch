const mongoose = require("mongoose");
const Application = require("../models/Application");
const Project = require("../models/Project");
const calculateCompatibility = require("../utils/matchScore");
const getCompatibilityExplanation = require("../utils/compatibilityExplaination");
const applyToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const studentId = req.user.id;

    // Check ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    // Check project exists
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Prevent recruiter from applying to own project
    if (project.createdBy.toString() === studentId) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own project.",
      });
    }

    // Check duplicate application
    const existingApplication = await Application.findOne({
      student: studentId,
      project: projectId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this project.",
      });
    }
   
    // Fetch student details
const student = await User.findById(studentId);

if (!student) {
    return res.status(404).json({
        success: false,
        message: "Student not found.",
    });
}

// Calculate compatibility score
const compatibility = calculateCompatibility(
    student.skills,
    project.requiredSkills
);

// Create application
const application = await Application.create({
    student: studentId,
    project: projectId,
    compatibilityScore: compatibility.score
});

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      compatibility,
      application,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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
        "name email skills github leetcode"
      )
      .sort({ createdAt: -1 });
      const applicantsWithExplanation = applications.map((application) => {

    const explanation = getCompatibilityExplanation(
        application.student.skills,
        project.requiredSkills
    );

    return {
        ...application.toObject(),
        explanation,
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
module.exports = {
  applyToProject,getApplicants,getMyApplications,updateApplicationStatus
};