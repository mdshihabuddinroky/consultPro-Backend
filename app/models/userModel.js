// models/userModel.js

const pool = require("../../config/db");

// Function to save a new user to the database
function saveUser(newUser) {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO users SET ?", newUser, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.insertId);
      }
    });
  });
}

// Function to update the OTP for a user based on the provided number
function updateUserOTP(number, otp) {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE users SET otp = ? WHERE number = ?",
      [otp, number],
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

// Function to get a user by their number
async function getUserByNumber(number) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT user_id, number, is_verified, verification_token, profile_type, otp FROM users WHERE number = ?",
        [number],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.length > 0 ? results[0] : null);
          }
        }
      );
    });
  }

// Function to update the is_verified status for a user based on the provided number 
function verifyUser(number) {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE users SET is_verified = true, verification_token = null WHERE number = ?",
      [number],
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

module.exports = { saveUser, updateUserOTP, getUserByNumber, verifyUser };
