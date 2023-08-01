// app/models/chatMessageModel.js
const pool = require('../../config/db');

class ChatMessage {
  // Method to save a new chat message to the database
  static async saveMessage(messageData) {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO chat_messages SET ?', messageData, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Method to get chat messages between two users
  static async getChatMessages(senderId, receiverId) {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM chat_messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at',
        [senderId, receiverId, receiverId, senderId],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  }
}

module.exports = ChatMessage;
