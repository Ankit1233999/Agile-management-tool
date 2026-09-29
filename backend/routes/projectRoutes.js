const express = require('express');
const { createProject, getProjects } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createProject).get(protect, getProjects);

module.exports = router;