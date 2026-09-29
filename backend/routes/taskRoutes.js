const express = require('express');
const { 
  createTask, 
  getProjectTasks, 
  updateTaskStatus 
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createTask);
router.route('/project/:projectId').get(protect, getProjectTasks);
router.route('/:id/status').patch(protect, updateTaskStatus);

module.exports = router;