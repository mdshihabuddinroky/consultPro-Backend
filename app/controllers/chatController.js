// chatController.js 
const ChatMessage = require('../models/chatMessageModel');
const WebSockets = require('../utils/websockets');
//const io = require('../index').io;
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message, messageType } = req.body;
    const senderId = req.user.user_id;
    const messageData = {
      sender_id: senderId,
      receiver_id: receiverId,
      message: message,
      message_type: messageType,
      created_at: new Date(),
    };
   await ChatMessage.saveMessage(messageData);
       // Access the websockets instance from the app using req.app
       const websockets = req.app.get('websockets');

       io.to(receiverId).emit('newMessage', { message: messageData });
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Controller to get chat messages between two users
exports.getChatMessages = async (req, res) => {
  try {
    const { senderId } = req.user;
    const receiverId = parseInt(req.params.receiverId);

    const chatMessages = await ChatMessage.getChatMessages(senderId, receiverId);

    res.status(200).json({ messages: chatMessages });
  } catch (error) {
    console.error('Error getting chat messages:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller to get the user chat list
exports.getUserChatList = async (req, res) => {
  try {
    const { senderId } = req.user;

    // Get the distinct list of users with whom the sender has chatted
    const chatList = await ChatMessage.getDistinctChatUsers(senderId);

    res.status(200).json({ chatList: chatList });
  } catch (error) {
    console.error('Error getting user chat list:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
