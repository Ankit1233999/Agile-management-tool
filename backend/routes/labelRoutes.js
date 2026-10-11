const express = require('express');
const { createLabel, getProjectLabels } = require('../controllers/labelController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createLabel);
router.route('/project/:projectId').get(protect, getProjectLabels);

module.exports = router;