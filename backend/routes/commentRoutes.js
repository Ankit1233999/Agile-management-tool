const express = require('express');
const { addComment, getTaskComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, addComment);
router.route('/task/:taskId').get(protect, getTaskComments);

module.exports = router;