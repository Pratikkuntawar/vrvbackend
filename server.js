const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Welcome to VRV BACKEND")
})
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
