const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { AppError } = require('../utils/errors');

// Helper function to exclude password from user object
const excludePassword = (user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

// REGISTER
const register = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }

        const { name, email, password, role } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return next(new AppError('User already exists', 400));
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'employee',
        });

        const token = generateToken(user.id, user.role);

        // Exclude password from response
        const cleanUser = excludePassword(user);

        res.status(201).json({
            success: true,
            token,
            user: cleanUser,
        });
    } catch (error) {
        next(error);
    }
};

// LOGIN
const login = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);

        if (!user) {
            return next(new AppError('Invalid credentials', 401));
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new AppError('Invalid credentials', 401));
        }

        const token = generateToken(user.id, user.role);

        // Exclude password from response
        const cleanUser = excludePassword(user);

        res.status(200).json({
            success: true,
            token,
            user: cleanUser,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };