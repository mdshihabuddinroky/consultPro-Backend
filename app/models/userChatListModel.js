// app/models/userChatListModel.js
const pool = require('../../config/db');

// Function to get the distinct list of users with whom the sender has chatted
exports.getDistinctChatUsers = async (senderId) => {
  try {
    // Query the database to get the distinct list of users with whom the sender has chatted
    const query = `
      SELECT receiver_id,
        message AS last_message,
        created_at AS last_message_time
      FROM chat_messages
      WHERE sender_id = ?
      GROUP BY receiver_id
      ORDER BY created_at DESC;
    `;

    const result = await db.query(query, [senderId]);

    // Transform the result into the desired format
    const chatList = result.map((row) => ({
      user_id: row.receiver_id,
      last_message: row.last_message,
      last_message_time: row.last_message_time,
    }));

    return chatList;
  } catch (error) {
    throw error;
  }
};
