// orderModel.js

const mongoose = require('mongoose');

// Define the sub-schema for individual items within the cartItems array
const cartItemSchema = new mongoose.Schema({
    // 'product' here refers to the _id of the Product document
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // This is a reference to your Product model
        required: [true, 'Product ID is required for a cart item']
    },
    name: { // The name of the product at the time of order
        type: String,
        required: [true, 'Product name is required for a cart item']
    },
    price: { // The price of the product at the time of order
        type: Number,
        required: [true, 'Product price is required for a cart item']
    },
    quantity: { // The quantity of this specific product in the order
        type: Number,
        required: [true, 'Quantity is required for a cart item'],
        min: [1, 'Quantity must be at least 1']
    },
    size: { // Include size if you're tracking it per item in an order
        type: String,
        // You might want to make this required if all your products have sizes
        // or add an enum for valid sizes if it's a fixed set.
        // For now, making it optional:
        // required: [true, 'Size is required for a cart item'],
        // enum: ['S', 'M', 'L', 'XL', 'XXL'] // Example if you have fixed sizes
    }
}, { _id: false }); // Do not create an _id for each cart item sub-document

const orderSchema = new mongoose.Schema({
    cartItems: {
        type: [cartItemSchema], // This makes cartItems an array of documents conforming to cartItemSchema
        required: [true, 'Cart items cannot be empty for an order']
    },
    amount: { // Total amount of the order
        type: String, // Keeping it as String as per your DB screenshot, but Number is generally better for currency
        required: [true, 'Order amount is required']
    },
    status: {
        type: String,
        default: 'pending' // Default status for new orders
    },
    createdAt: {
        type: Date,
        default: () => {
            // Get current UTC time
            const now = new Date();
            // Calculate offset for IST (UTC+5:30). 5 hours * 60 minutes + 30 minutes = 330 minutes
            // Convert to milliseconds: 330 * 60 * 1000 = 19,800,000 milliseconds
            const istOffset = 330 * 60 * 1000;
            // Apply offset to get IST time in milliseconds
            const istTime = now.getTime() + istOffset;
            // Return a new Date object representing IST
            // Mongoose will save this Date as a UTC ISODate in MongoDB.
            // When retrieved, it will still appear as UTC (e.g., {"$date": "..."}).
            // You will format this UTC date to IST on your frontend for display.
            return new Date(istTime);
        }
    },
    customerInfo: {
        name: {
            type: String,
            required: [true, 'Customer name is required']
        },
        address: {
            type: String,
            required: [true, 'Customer address is required']
        },
        phone: {
            type: String,
            required: [true, 'Customer phone number is required']
        }
    }
});

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;