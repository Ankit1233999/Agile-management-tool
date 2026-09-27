import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000
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
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    position: {
      type: Number,
      required: true,
      default: 0
    },

    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Card", cardSchema);