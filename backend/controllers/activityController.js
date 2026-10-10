const Activity = require('../models/Activity');

// Get all activities for a specific project
const getProjectActivities = async (req, res) => {
  try {
    const { projectId } = req.params;
    const activities = await Activity.find({ project: projectId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 }); // Latest activities first
      
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjectActivities };