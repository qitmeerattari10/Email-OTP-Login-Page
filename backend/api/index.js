
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get('/', (req, res) => {
    res.send('Email OTP Login API is running');
});

// Auth Routes
app.use('/api/auth', authRoutes);

// User Routes
app.use('/api/user', userRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODBURI)
    .then(() => {
        console.log('MongoDB Connected Successfully');

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log('MongoDB Connection Failed:', error);
    });
