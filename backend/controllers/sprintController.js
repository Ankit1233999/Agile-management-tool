const Sprint = require('../models/Sprint');
const Project = require('../models/Project');

// Create a new sprint
const createSprint = async (req, res) => {
  try {
    const { name, startDate, endDate, project, status } = req.body;

    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const sprint = await Sprint.create({
      name,
      startDate,
      endDate,
      project,
      status: status || 'Planned',
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

// Update sprint status
const updateSprintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const sprint = await Sprint.findById(req.params.id);

    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    sprint.status = status || sprint.status;
    const updatedSprint = await sprint.save();

    res.status(200).json(updatedSprint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSprint, getProjectSprints, updateSprintStatus };