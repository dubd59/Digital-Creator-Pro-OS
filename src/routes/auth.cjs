const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile } = require('../controllers/authController.cjs');
const { authenticateToken } = require('../middleware/auth.cjs');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', authenticateToken, logout);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;