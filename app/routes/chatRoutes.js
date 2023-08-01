// app/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to the chat routes
router.post('/send-message', authMiddleware.authenticateToken, chatController.sendMessage);
router.get('/get-chat-messages/:receiverId', authMiddleware.authenticateToken, chatController.getChatMessages);
router.get('/user-chat-list', authMiddleware.authenticateToken, chatController.getUserChatList);

module.exports = router;
