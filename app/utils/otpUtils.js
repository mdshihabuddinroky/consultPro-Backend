// utils/otpUtils.js

// Function to generate a random 6-digit OTP
function generateOTP() {
    const otpLength = 6;
    let otp = "";
    for (let i = 0; i < otpLength; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }
  
  module.exports = { generateOTP };
  