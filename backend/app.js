const express = require('express');
const app = express();
// const dotenv = require('dotenv'); // <--- You might not need this line if only using Render's env vars
const path = require('path')
const cors = require('cors')
const connectDatabase = require('./config/connectDatabase')

// REMOVE or COMMENT OUT THIS LINE FOR RENDER DEPLOYMENTS:
// dotenv.config({path: path.join(__dirname,'config','config.env')});


const products = require('./routes/products');
const order = require('./routes/order');

connectDatabase();
app.use(express.json());
app.use(cors({
    origin: 'https://nithi-cart-front.onrender.com', // Replace with your actual frontend URL from Render
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
    credentials: true
}));
app.use('/api/v1/', products);
app.use('/api/v1/', order);


app.listen(process.env.PORT, () => {
    console.log(`Server listening to Port ${process.env.PORT} in ${process.env.NODE_ENV}`)
})
