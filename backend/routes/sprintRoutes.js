const express = require('express');
const { 
  createSprint, 
  getProjectSprints, 
  updateSprintStatus 
} = require('../controllers/sprintController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createSprint);
router.route('/project/:projectId').get(protect, getProjectSprints);
router.route('/:id/status').patch(protect, updateSprintStatus);

module.exports = router;