// app/models/userChatListModel.js
const pool = require('../../config/db');
// Function to get the distinct list of chat users for a given user
exports.getDistinctChatUsers = async (userId) => {
  try {
    // Query the database to get the distinct list of users with whom the given user has chatted
    const query = `
      SELECT DISTINCT
        CASE
          WHEN sender_id = ? THEN receiver_id
          WHEN receiver_id = ? THEN sender_id
        END AS chat_with_user_id,
        MAX(created_at) AS last_message_time
      FROM chat_messages
      WHERE sender_id = ? OR receiver_id = ?
      GROUP BY chat_with_user_id
      ORDER BY last_message_time DESC;
    `;

    const result = await db.query(query, [userId, userId, userId, userId]);

    // Transform the result into the desired format
    const chatList = result.map((row) => ({
      user_id: userId, // The user for whom you're retrieving the chat list
      chat_with_user_id: row.chat_with_user_id,
      last_message_time: row.last_message_time,
    }));

    return chatList;
  } catch (error) {
    throw error;
  }
};
