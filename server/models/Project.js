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