const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const oauth = require("../controllers/oauthController");
const { isStudent } = require("../middleware/roleMiddleware");
const { requestReset, resetPassword } = require("../controllers/passwordResetController");

router.post("/signup", signup);

router.post("/login", login);
router.post("/forgot-password", requestReset);
router.post("/reset-password", resetPassword);
router.post("/oauth/exchange", oauth.exchange);
router.post("/oauth/github/connect", protect, isStudent, oauth.connectGithub);
router.get("/oauth/:provider/start", oauth.start);
router.get("/oauth/:provider/callback", oauth.callback);

// Protected test route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome! This is a protected route.",
    user: req.user,
  });
});

module.exports = router;
