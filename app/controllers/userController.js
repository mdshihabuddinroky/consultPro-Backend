// controllers/userController.js

// const { generateToken } = require("../utils/jwtUtils");
// const { generateOTP } = require("../utils/otpUtils");
// const User = require("../models/userModel");


// controllers/userController.js

const { generateToken } = require("../utils/jwtUtils");
const { generateOTP } = require("../utils/otpUtils");
const User = require("../models/userModel");

// Function to register a new user or login an existing user

async function registerOrLoginUser(req, res) {
    try {
      const { number, profile_type, fcm_token } = req.body;
      // Validate that the number is provided
      if (!number) {
        return res.status(400).json({ message: "Number is required" });
      }
  
      // Check if the user with the provided number exists
      const user = await User.getUserByNumber(number);
  
      if (user) {
        // User already exists, so this is a login attempt
  
        // User is already verified, proceed with the login logic
        // Generate and send a new JWT token to the client for authenticated requests
        const payload = {
          user_id: user.user_id,
          number: user.number,
          profile_type: user.profile_type,
        };
        const token = generateToken(payload);

        const otp = generateOTP();
        await User.updateUserOTP(user.number, otp);
        return res
        .status(201)
        .json({ message: "User login successfully. OTP sent for verification" });
    
      } else {
        // User does not exist, so this is a registration attempt
        // Generate a new OTP for the new user
        const otp = generateOTP();
        const newUser = {
          number: number,
          otp: otp, // Save the OTP in the otp field
          profile_type: profile_type || "Normal User", // Default profile type if not provided
          fcm_token: fcm_token || null, // Save the FCM token if provided
        };
  
        // Save the new user to the database
        const createdUserId = await User.saveUser(newUser);
  
        // In a real application, send the OTP to the user's mobile number via SMS
        // For demo purposes, we'll just return a generic success message
        return res
          .status(201)
          .json({ message: "User registered successfully. OTP sent for verification" });
      }
    } catch (error) {
      console.error("Error during user registration/login:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  

// Function to verify the OTP provided by the user
async function verifyOTP(req, res) {
  try {
    const { number, verification_code } = req.body;
    // Validate that both number and verification_code are provided
    if (!number || !verification_code) {
      return res.status(400).json({ message: "Number and OTP are required" });
    }

    // Check if the user exists based on the provided number
    const user = await User.getUserByNumber(number);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the verification code (OTP) matches the stored verification_token
    if (user.otp !== verification_code) {
        console.log(user.otp, verification_code);
      return res.status(400).json({ message: "Invalid OTP" });
     }
    // await User.verifyUser(number);

    // Generate and send a new JWT token to the client for authenticated requests
    const payload = {
      user_id: user.user_id,
      number: user.number,
      profile_type: user.profile_type,
    };
    const token = generateToken(payload);

    // Return the response without the OTP
    return res.status(200).json({
      message: "OTP verification successful",
      token: token,
      user_id: user.user_id,
      is_verified: true,
      profile_type: user.profile_type,
    });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { registerOrLoginUser, verifyOTP };
