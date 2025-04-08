const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/messageController');

const router = express.Router();

router.post('/send', protect, sendMessage);  // Send a new message
router.get('/:chatId', protect, getMessages); // Get messages in a chat

module.exports = router;
