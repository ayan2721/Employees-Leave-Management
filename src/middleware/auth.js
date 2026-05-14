const { verifyToken } = require('../utils/jwt');
const { AppError } = require('../utils/errors');
const User = require('../models/User');

const authenticate = async(req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401));
        }

        const decoded = verifyToken(token);

        const currentUser = await User.findById(decoded.userId);
        if (!currentUser) {
            return next(new AppError('The user belonging to this token does no longer exist.', 401));
        }

        req.user = currentUser;
        next();
    } catch (error) {
        return next(new AppError('Invalid token', 401));
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

module.exports = {
    authenticate,
    authorize
};