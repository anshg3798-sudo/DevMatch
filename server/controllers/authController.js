const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { normalizeEmail, isValidEmail } = require("../utils/email");

function loginResponse(user) {
  return {
    success: true,
    message: "Login Successful",
    token: jwt.sign(
      { id: user._id, role: user.role, passwordVersion: user.passwordVersion },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    ),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
}

// ======================= SIGNUP =======================

const signup = async (req, res) => {
  try {
    const { name, password, role } = req.body || {};
    const email = normalizeEmail(req.body?.email);

    // Check required fields
    if (typeof name !== "string" || !name.trim() || typeof password !== "string" || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address." });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================= LOGIN =======================

const login = async (req, res) => {
  try {

    const { password } = req.body || {};
    const email = normalizeEmail(req.body?.email);

    // Check required fields
    if (!isValidEmail(email) || typeof password !== "string" || !password) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address and password.",
      });
    }

    // Find user
    const user = await User.findOne({ email }).select("+passwordVersion");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Compare password
    const isMatch = user.password && await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    return res.json(loginResponse(user));

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  signup,
  login,
  loginResponse,
};
