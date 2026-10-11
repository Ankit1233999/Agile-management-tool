const Attachment = require('../models/Attachment');

// Add an attachment to a task
const addAttachment = async (req, res) => {
  try {
    const { fileName, fileUrl, taskId } = req.body;

    const attachment = await Attachment.create({
      fileName,
      fileUrl,
      task: taskId,
      uploadedBy: req.user._id,
    });

    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all attachments for a specific task
const getTaskAttachments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const attachments = await Attachment.find({ task: taskId }).populate('uploadedBy', 'name email');
    res.status(200).json(attachments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addAttachment, getTaskAttachments };