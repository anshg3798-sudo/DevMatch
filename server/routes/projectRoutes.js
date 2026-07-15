// routes/projectRoutes.js

const express = require("express");

const router = express.Router();

const { createProject } = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

const {
    isRecruiter
} = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    isRecruiter,
    createProject
);

module.exports = router;