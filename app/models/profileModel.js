// profileModel.js
const pool = require("../../config/db");

// Function to create a new profile
function createProfile(profileData) {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO professionals SET ?", profileData, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve({ ...profileData, professional_id: results.insertId });
      }
    });
  });
}

// Function to update an existing profile
function updateProfile(user_id, profileDataToUpdate) {
  return new Promise((resolve, reject) => {
    pool.query("UPDATE professionals SET ? WHERE user_id = ?", [profileDataToUpdate, user_id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.affectedRows > 0 ? { ...profileDataToUpdate, user_id: user_id } : null);
      }
    });
  });
}

module.exports = { createProfile, updateProfile };
