const Project = require('../models/Project');

// Get all projects for logged-in user
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).populate('members', 'name email');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new project
const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Please add name and description' });
    }

    const project = await Project.create({
      name,
      description,
      user: req.user._id,
      members: members || [],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, createProject };