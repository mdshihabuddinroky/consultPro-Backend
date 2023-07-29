// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Correct file path

// Registration and login route
router.post("/auth", userController.registerOrLoginUser);

// OTP verification route
router.post("/verify-otp", userController.verifyOTP);

module.exports = router;
