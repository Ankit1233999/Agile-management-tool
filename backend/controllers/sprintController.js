const Sprint = require('../models/Sprint');
const Project = require('../models/Project');

// Create a new sprint
const createSprint = async (req, res) => {
  try {
    const { name, startDate, endDate, project } = req.body;

    // Verify project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const sprint = await Sprint.create({
      name,
      startDate,
      endDate,
      project
    });

    res.status(201).json(sprint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all sprints for a specific project
const getProjectSprints = async (req, res) => {
  try {
    const { projectId } = req.params;

    const sprints = await Sprint.find({ project: projectId });
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSprint, getProjectSprints };