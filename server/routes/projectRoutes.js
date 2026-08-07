// routes/projectRoutes.js

const express = require("express");

const router = express.Router();

const {
     createProject,getAllProjects,getProjectById,updateProject,deleteProject
     } = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

const {
    isRecruiter
} = require("../middleware/roleMiddleware");

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post(
    "/",
    authMiddleware,
    isRecruiter,
    createProject
);
router.put(
    "/:id",
    authMiddleware,
    isRecruiter,
    updateProject
);
router.delete(
    "/:id",
    authMiddleware,
    isRecruiter,
    deleteProject
);
module.exports = router;