const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Load .env variables FIRST before anything else
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());                    // allow all origins (frontend on :5173 can call this)
app.use(express.json());            // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form data too

// Health check — visit http://localhost:5000/api/health to confirm server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'AdaptAI backend is running ✅' });
});

// Routes
app.use('/api/query', require('./routes/queryRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 AdaptAI backend running at http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
});
