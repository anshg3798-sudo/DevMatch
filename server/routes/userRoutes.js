const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
   searchDevelopers,
   getDeveloperById,
    uploadResume,
} = require("../controllers/userController");
const resumeUpload = require(
  "../middleware/resumeUpload"
);
const authMiddleware = require("../middleware/authMiddleware");
const { isRecruiter } = require("../middleware/roleMiddleware");
router.get(
  "/profile",
  authMiddleware,
  getProfile
);
router.get(
  "/developers",
  authMiddleware,
  isRecruiter,
  searchDevelopers
);
router.post(
  "/resume",
  authMiddleware,
  resumeUpload.single("resume"),
  uploadResume
);
router.get(
  "/developers/:id",
  authMiddleware,
  isRecruiter,
  getDeveloperById
);
router.patch(
  "/profile",
  authMiddleware,
  updateProfile
);
module.exports = router;