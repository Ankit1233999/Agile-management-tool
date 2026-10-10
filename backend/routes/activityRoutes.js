const express = require('express');
const { getProjectActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/project/:projectId').get(protect, getProjectActivities);

module.exports = router;