const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Register route
router.post('/register', [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['employee', 'manager']).withMessage('Role must be either employee or manager')
], register);

// Login route
router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required')
], login);

module.exports = router;