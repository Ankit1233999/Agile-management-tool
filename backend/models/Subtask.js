const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a subtask title'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Task',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Subtask', subtaskSchema);