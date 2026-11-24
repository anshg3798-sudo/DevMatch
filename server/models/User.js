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
    },

    oauthIdentity: {
      type: String,
      unique: true,
      sparse: true,
      select: false,
    },

    googleIdentity: { type: String, unique: true, sparse: true, select: false },
    githubIdentity: { type: String, unique: true, sparse: true, select: false },
    passwordResetDigest: { type: String, select: false },
    passwordResetExpiresAt: { type: Date, select: false },
    passwordResetRequestedAt: { type: Date, select: false },
    passwordVersion: { type: String, select: false },

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
   
verification: {
  status: {
    type: String,
    enum: [
      "Not Verified",
      "Verified",
      "Failed",
      "Unable to Verify",
    ],
    default: "Not Verified",
  },

  repositoryExists: {
    type: Boolean,
    default: false,
  },

  hasReadme: {
    type: Boolean,
    default: false,
  },

  hasCode: {
    type: Boolean,
    default: false,
  },

  detectedLanguages: {
    type: [String],
    default: [],
  },

  detectedTechnologies: {
    type: [String],
    default: [],
  },

  matchedTechnologies: {
    type: [String],
    default: [],
  },

  missingTechnologies: {
    type: [String],
    default: [],
  },

  // Detailed project relevance information
  relevance: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },

  // Project structure and domain evidence
  projectEvidence: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },

  // Ownership and authenticity analysis
  authenticity: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },

  verifiedAt: {
    type: Date,
    default: null,
  },
},
 
  },
],
resumeUrl: {
  type: String,
  default: "",
},

resumeFileName: {
  type: String,
  default: "",
},
  },
  {
    timestamps: true,
  }
);

userSchema.index({ passwordResetDigest: 1 }, { sparse: true });

module.exports = mongoose.model("User", userSchema);
