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

module.exports = {
    createProject
};