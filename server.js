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
app.use(cors({
    origin: "https://zealous-ocean-0f8a6d400.7.azurestaticapps.net"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);

// Error handling middleware
app.use(errorHandler);
app.get("/", (req, res) => {
    res.send("Employees Leave Management Backend Running");
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;