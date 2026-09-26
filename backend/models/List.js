import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true
    },

    position: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("List", listSchema);