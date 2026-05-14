const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth');
const leaveRoutes = require('./src/routes/leave');

const { errorHandler } = require('./src/middleware/errorHandler');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;