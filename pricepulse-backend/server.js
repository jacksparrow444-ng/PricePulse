// Ye line sabse upar honi chahiye (agar pehle se nahi hai toh)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const mysql = require('mysql2');

// Connection handled by config/db.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const priceRoutes = require('./routes/priceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', priceRoutes);

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', message: 'PricePulse Nodes Active' }));

// 404 Handler
app.use((req, res) => res.status(404).json({ error: 'Endpoint Uncharted' }));

app.listen(PORT, () => console.log(`PricePulse Advanced Core: Running on Port ${PORT} 🚀`));