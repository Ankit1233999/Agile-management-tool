const express = require('express');
const { createWorkspace, getUserWorkspaces } = require('../controllers/workspaceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createWorkspace).get(protect, getUserWorkspaces);

module.exports = router;