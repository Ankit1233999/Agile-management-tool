const express = require('express');
const { addAttachment, getTaskAttachments } = require('../controllers/attachmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, addAttachment);
router.route('/task/:taskId').get(protect, getTaskAttachments);

module.exports = router;