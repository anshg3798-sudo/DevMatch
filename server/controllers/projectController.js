// controllers/projectController.js

const Project = require("../models/Project");

const createProject = async (req, res) => {
    try {

        const {
            title,
            description,
            requiredSkills
        } = req.body;

        const project = await Project.create({
            title,
            description,
            requiredSkills,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Project created successfully",
            project
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};
const getAllProjects = async (req, res) => {
    try {

        const projects = await Project.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });

    }
};
const getProjectById = async (req, res) => {
    try {

        const project = await Project.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            project
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });

    }
};
const updateProject = async (req, res) => {
    try {

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        if (project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can update only your own projects."
            });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project: updatedProject
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });

    }
};
const deleteProject = async (req, res) => {
    try {

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        if (project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can delete only your own projects."
            });
        }

        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });

    }
};
const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            createdBy: req.user.id
        })
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects
        });

    } catch (error) {
        console.error("Get My Projects Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};
module.exports = {
    createProject,
    getAllProjects,
     getMyProjects,
    getProjectById,
    updateProject,
    deleteProject
};