import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    priority: {
      type: String,
      enum: [
        "low",
        "medium",
        "high"
      ],
      default: "medium"
    },

    position: {
      type: Number,
      default: 0
    },

    dueDate: {
      type: Date,
      default: null
    },

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },

        text: {
          type: String,
          trim: true
        },

        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Card",
  cardSchema
);