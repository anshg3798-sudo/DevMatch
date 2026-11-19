// models/Project.js

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        requiredSkills: [
            {
                type: String,
                trim: true
            }
        ],
      experienceRequired: {
  type: Number,
  default: 0,
  min: 0,
},

communicationRequired: {
  type: Number,
  default: 3,
  min: 1,
  max: 5,
},

availabilityRequired: {
  type: Number,
  default: 0,
  min: 0,
},

matchingWeights: {
  skills: {
    type: Number,
    default: 40,
    min: 0,
    max: 100,
  },

  availability: {
    type: Number,
    default: 20,
    min: 0,
    max: 100,
  },

  experience: {
    type: Number,
    default: 15,
    min: 0,
    max: 100,
  },

  communication: {
    type: Number,
    default: 15,
    min: 0,
    max: 100,
  },

  projects: {
    type: Number,
    default: 10,
    min: 0,
    max: 100,
  },
},

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Project", projectSchema);