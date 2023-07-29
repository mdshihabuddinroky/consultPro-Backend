const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware').default;

// Get categories with pagination
router.get('/', categoryController.getCategories);

// Create a new category (requires admin authentication)
router.post('/create', authMiddleware.authenticateToken, categoryController.createCategory);

// Delete a category by ID (requires admin authentication)
router.delete('/delete/:id', authMiddleware.authenticateToken, categoryController.deleteCategory);

module.exports = router;
