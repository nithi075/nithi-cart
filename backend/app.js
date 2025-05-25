const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDatabase = require('./config/connectDatabase');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Connect to database
connectDatabase();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'https://nithi-cart.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  credentials: true
}));

// Test API root
app.get('/', (req, res) => {
  res.send('API is working 🚀');
});

// Routes
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/orders', require('./routes/order'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server listening to Port ${process.env.PORT} in ${process.env.NODE_ENV}`);
});
