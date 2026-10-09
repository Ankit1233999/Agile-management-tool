const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a sprint name'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    status: {
      type: String,
      enum: ['Planned', 'Active', 'Completed'],
      default: 'Planned',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Sprint', sprintSchema);