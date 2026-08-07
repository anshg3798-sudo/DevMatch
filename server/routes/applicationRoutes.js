const express = require("express");

const router = express.Router();

const { applyToProject,getApplicants,getMyApplications,updateApplicationStatus } = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const { isStudent,isRecruiter } = require("../middleware/roleMiddleware");

router.post(
  "/:projectId",
  authMiddleware,
  isStudent,
  applyToProject
);
router.get(
    "/project/:projectId",
    authMiddleware,
    isRecruiter,
    getApplicants
);
router.get(
  "/my",
  authMiddleware,
  isStudent,
  getMyApplications
);
router.patch(
    "/:applicationId/status",
    authMiddleware,
    isRecruiter,
    updateApplicationStatus
);
module.exports = router;