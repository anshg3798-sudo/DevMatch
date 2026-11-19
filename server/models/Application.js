const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    compatibilityScore: {
      type: Number,
      default: 0,
    },

    compatibilityBreakdown: {
  skills: {
    type: Number,
    default: 0,
  },

  availability: {
    type: Number,
    default: 0,
  },

  experience: {
    type: Number,
    default: 0,
  },

  communication: {
    type: Number,
    default: 0,
  },

  projects: {
    type: Number,
    default: 0,
  },
},

matchedSkills: {
  type: [String],
  default: [],
},

missingSkills: {
  type: [String],
  default: [],
},
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    matchingWeightsUsed: {
  skills: { type: Number, default: 40 },
  availability: { type: Number, default: 20 },
  experience: { type: Number, default: 15 },
  communication: { type: Number, default: 15 },
  projects: { type: Number, default: 10 },
},
  },
  {
    timestamps: true,
  },
);
  applicationSchema.index(
  { student: 1, project: 1 },
  { unique: true }
  );


module.exports = mongoose.model("Application", applicationSchema);