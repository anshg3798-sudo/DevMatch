const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    github: {
      type: String,
      default: "",
    },

    leetcode: {
      type: String,
      default: "",
    },
  experienceYears: {
  type: Number,
  default: 0,
  min: 0,
},

communicationRating: {
  type: Number,
  default: 3,
  min: 1,
  max: 5,
},

availabilityHours: {
  type: Number,
  default: 0,
  min: 0,
},

projectsCount: {
  type: Number,
  default: 0,
  min: 0,
},
projects: [
  {
    name: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      default: "",
      trim: true,
    },
    liveUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);