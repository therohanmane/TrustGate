const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Files (Uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/assets');
const contactRoutes = require('./routes/contacts');
const safetyRoutes = require('./routes/safety');

app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/assets', assetRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/logs', require('./routes/logs'));

app.get('/', (req, res) => {
    res.send('TrustGate API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
