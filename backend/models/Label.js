const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a label name'],
      trim: true,
    },
    color: {
      type: String,
      default: '#3498db', // Default blue color for label
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Label', labelSchema);