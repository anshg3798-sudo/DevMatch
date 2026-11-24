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
    decisionId: String,
    decidedAt: Date,
    messages: {
      type: [new mongoose.Schema({
        senderRole: { type: String, enum: ["student", "recruiter"], required: true },
        text: { type: String, required: true, maxlength: 2000 },
        sentAt: { type: Date, required: true },
      })],
      default: undefined,
      select: false,
    },
    studentUnread: Number,
    recruiterUnread: Number,
    lastMessageAt: Date,
    selectionEmail: {
      type: new mongoose.Schema({
        to: String,
        projectTitle: String,
        decisionId: String,
        status: { type: String, enum: ["Accepted", "Rejected"] },
        nextAttemptAt: { type: Date, index: true },
        retryUntil: Date,
        sentAt: Date,
      }, { _id: false }),
      select: false,
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
