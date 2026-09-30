const express = require('express');
const { 
  createSprint, 
  getProjectSprints 
} = require('../controllers/sprintController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createSprint);
router.route('/project/:projectId').get(protect, getProjectSprints);

module.exports = router;