const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number, // <-- Confirmed this should be Number
    description: String,
    ratings: Number, // <-- Confirmed this should be Number
    images : [
        {
            image: String
        }
    ],
    category: String,
    seller: String,
    stock: Number, // <-- This is for products WITHOUT sizes, or general stock
                   //     If all your products use 'sizes', this might not be strictly needed for actual stock,
                   //     but it's good to keep for consistency or future products without sizes.
    numOfReviews: Number, // <-- Should also be Number
    createdAt: Date,
    // *** ADD/CONFIRM THIS `sizes` ARRAY DEFINITION ***
    sizes: [
        {
            size: {
                type: String,
                required: true
            },
            stock: { // <--- THIS IS THE CRUCIAL ONE FOR PRODUCTS WITH SIZES
                type: Number,
                required: true,
                default: 0
            }
        }
    ]
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;