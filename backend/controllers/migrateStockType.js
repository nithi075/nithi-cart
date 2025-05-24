// migrateStockType.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel'); // Ensure this path is correct

// IMPORTANT: Adjust this path to your config.env file
// Based on your error path (E:\nithi cart\backend\controllers\orderController.js),
// it seems like your backend root is E:\nithi cart\backend.
// So, if config.env is in E:\nithi cart\backend\config, the path should be correct.
dotenv.config({ path: 'E:/nithi cart/backend/config/config.env' });

const DB_URI = process.env.DB_URI;

if (!DB_URI) {
    console.error('Error: DB_URI is not defined in your config.env. Please check your .env file.');
    console.error('Current process.env.DB_URI:', DB_URI);
    process.exit(1);
}

mongoose.connect(DB_URI)
    .then(() => {
        console.log('MongoDB Connected for migration.');
        migrateStock();
    })
    .catch(err => {
        console.error('MongoDB connection error during migration:', err);
        process.exit(1);
    });

async function migrateStock() {
    try {
        console.log('Starting stock data type migration...');

        // Find all products where stock is currently a string
        const productsToUpdate = await Product.find({
            $or: [
                { stock: { $type: "string" } },
                { 'sizes.stock': { $type: "string" } }
            ]
        });

        if (productsToUpdate.length === 0) {
            console.log('No products found with string stock values. Migration complete.');
            return; // No need to disconnect here, finally block handles it
        }

        console.log(`Found ${productsToUpdate.length} products to update.`);

        for (const product of productsToUpdate) {
            let needsUpdate = false;

            // Check and convert top-level stock
            if (typeof product.stock === 'string') {
                const numStock = parseInt(product.stock, 10);
                if (!isNaN(numStock)) {
                    product.stock = numStock;
                    needsUpdate = true;
                    console.log(`Converting top-level stock for product ${product._id} from "${product.stock}" to ${numStock}`);
                } else {
                    console.warn(`Could not parse top-level stock string "${product.stock}" for product ${product._id}. Setting to 0.`);
                    product.stock = 0;
                    needsUpdate = true;
                }
            }

            // Check and convert stock within sizes array
            if (product.sizes && Array.isArray(product.sizes)) {
                product.sizes.forEach(size => {
                    if (typeof size.stock === 'string') {
                        const numStock = parseInt(size.stock, 10);
                        if (!isNaN(numStock)) {
                            size.stock = numStock;
                            needsUpdate = true;
                            console.log(`Converting size stock for product ${product._id}, size ${size.size} from "${size.stock}" to ${numStock}`);
                        } else {
                            console.warn(`Could not parse size stock string "${size.stock}" for product ${product._id}, size ${size.size}. Setting to 0.`);
                            size.stock = 0;
                            needsUpdate = true;
                        }
                    }
                });
            }

            if (needsUpdate) {
                // Use save() as we've modified the Mongoose document in memory
                await product.save();
                console.log(`Successfully updated stock type for product ID: ${product._id}`);
            } else {
                console.log(`Product ID: ${product._id} did not need stock type conversion.`);
            }
        }

        console.log('Stock data type migration finished.');

    } catch (err) {
        console.error('Error during migration:', err);
    } finally {
        mongoose.disconnect(); // Disconnect Mongoose after operations
    }
}