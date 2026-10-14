const Workspace = require('../models/Workspace');

// Create a new workspace
const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get workspaces for logged-in user
const getUserWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ members: req.user._id }).populate('owner', 'name email');
    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createWorkspace, getUserWorkspaces };