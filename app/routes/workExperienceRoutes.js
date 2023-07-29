const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware').default;
const {
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
} = require('../controllers/workExperienceController');

// Create a work experience (requires authentication)
router.post('/work-experiences/create', authMiddleware.authenticateToken, createWorkExperience);

// Update a work experience (requires authentication)
router.put('/work-experiences/update/:work_experience_id', authMiddleware.authenticateToken, updateWorkExperience);

// Delete a work experience (requires authentication)
router.delete('/work-experiences/delete/:work_experience_id', authMiddleware.authenticateToken, deleteWorkExperience);

module.exports = router;
