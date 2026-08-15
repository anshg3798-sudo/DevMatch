const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/signup", signup);

router.post("/login", login);

// Protected test route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome! This is a protected route.",
    user: req.user,
  });
});

module.exports = router;