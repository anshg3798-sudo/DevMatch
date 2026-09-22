const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
   searchDevelopers,
   getDeveloperById,
} = require("../controllers/userController");

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