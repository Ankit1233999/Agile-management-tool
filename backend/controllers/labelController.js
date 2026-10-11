const Label = require('../models/Label');

// Create a new label for a project
const createLabel = async (req, res) => {
  try {
    const { name, color, project } = req.body;

    const label = await Label.create({
      name,
      color,
      project,
    });

    res.status(201).json(label);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all labels for a specific project
const getProjectLabels = async (req, res) => {
  try {
    const { projectId } = req.params;
    const labels = await Label.find({ project: projectId });
    res.status(200).json(labels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createLabel, getProjectLabels };