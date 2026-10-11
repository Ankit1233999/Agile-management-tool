const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: [true, 'Please add a file name'],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Please add a file URL or path'],
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Task',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Attachment', attachmentSchema);