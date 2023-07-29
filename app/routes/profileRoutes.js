const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware').default;
const { createProfile, updateProfile } = require('../controllers/profileController');

// Create a profile (requires authentication)
router.post('/create', authMiddleware.authenticateToken, createProfile);
// Update the profile (requires authentication)
router.put('/update', authMiddleware.authenticateToken, updateProfile);


module.exports = router;
