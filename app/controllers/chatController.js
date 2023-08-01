// app/controllers/chatController.js
const ChatMessage = require('../models/chatMessageModel');
const UserChatList = require('../models/userChatListModel');

// Controller to send a chat message
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, messageType } = req.body;

    const messageData = {
      sender_id: senderId,
      receiver_id: receiverId,
      message: message,
      message_type: messageType,
    };

    await ChatMessage.saveMessage(messageData);

    // Update sender's chat list
    const senderChatData = {
      user_id: senderId,
      chat_with_user_id: receiverId,
      last_message: message,
      last_message_time: new Date(),
    };
    await UserChatList.updateChatList(senderChatData);

    // Update receiver's chat list
    const receiverChatData = {
      user_id: receiverId,
      chat_with_user_id: senderId,
      last_message: message,
      last_message_time: new Date(),
    };
    await UserChatList.updateChatList(receiverChatData);

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

    const chatList = await UserChatList.getUserChatList(senderId);

    res.status(200).json({ chatList: chatList });
  } catch (error) {
    console.error('Error getting user chat list:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
