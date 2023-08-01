// app/models/userChatListModel.js
const pool = require('../../config/db');

class UserChatList {
  // Method to get the list of users a user has chatted with
  static async getUserChatList(userId) {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM user_chat_list WHERE user_id = ? ORDER BY last_message_time DESC',
        [userId],
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

  // Method to update or insert a new entry in the user_chat_list table
  static async updateChatList(listData) {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO user_chat_list (user_id, chat_with_user_id, last_message, last_message_time) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE last_message = ?, last_message_time = ?',
        [
          listData.user_id,
          listData.chat_with_user_id,
          listData.last_message,
          listData.last_message_time,
          listData.last_message,
          listData.last_message_time,
        ],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
}

module.exports = UserChatList;
