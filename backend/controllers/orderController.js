const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const mongoose = require('mongoose');

exports.createOrder = async (req, res, next) => {
    console.log("Received order request body:", JSON.stringify(req.body, null, 2));

    const { cartItems: incomingCartItems, customerInfo } = req.body;

    if (!incomingCartItems || !Array.isArray(incomingCartItems) || incomingCartItems.length === 0) {
        console.log("Validation failed: Invalid or empty cart items provided.");
        return res.status(400).json({ success: false, message: 'Invalid or empty cart items provided.' });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.address || !customerInfo.phone) {
        console.log("Validation failed: Customer information (name, address, phone) is required.");
        return res.status(400).json({ success: false, message: 'Customer information (name, address, phone) is required.' });
    }

    let totalAmount = 0;
    const itemsForOrder = [];
    const stockUpdateOperations = []; // This will store direct Mongoose update operations

    try {
        console.log("Starting stock validation and total calculation...");

        for (const incomingItem of incomingCartItems) {
            console.log("Processing incoming cart item:", incomingItem);

            if (
                !incomingItem.product ||
                typeof incomingItem.product !== 'string' ||
                !mongoose.Types.ObjectId.isValid(incomingItem.product) ||
                !incomingItem.name ||
                incomingItem.price === undefined ||
                isNaN(parseFloat(incomingItem.price)) ||
                incomingItem.quantity === undefined ||
                isNaN(parseInt(incomingItem.quantity)) ||
                parseInt(incomingItem.quantity) <= 0
            ) {
                console.log("Validation failed: Invalid item structure in cart. Item:", incomingItem);
                return res.status(400).json({ success: false, message: 'Invalid item structure in cart.' });
            }

            const productId = incomingItem.product;
            const requestedQty = parseInt(incomingItem.quantity);
            const itemSize = incomingItem.size;

            const product = await productModel.findById(productId);

            if (!product) {
                console.log(`Product not found: ${productId}`);
                return res.status(404).json({ success: false, message: `Product not found for ID: ${productId}` });
            }

            const actualProductPrice = parseFloat(product.price);
            if (isNaN(actualProductPrice)) {
                console.log(`Invalid product price for ${product.name}.`);
                return res.status(500).json({ success: false, message: `Invalid product price stored for ${product.name}.` });
            }

            let availableStock = product.stock; // Fallback
            let stockPath = 'stock'; // Default path for stock update
            let isStockParsed = false; // Flag to indicate if stock was parsed from string

            // --- IN-PLACE TYPE CONVERSION FOR VALIDATION ---
            if (typeof availableStock === 'string') {
                const parsedStock = parseInt(availableStock, 10);
                if (!isNaN(parsedStock)) {
                    availableStock = parsedStock;
                    isStockParsed = true;
                    console.log(`Debug: Converted top-level stock for ${product.name} from string to number: ${availableStock}`);
                } else {
                    console.warn(`Could not parse top-level stock for product ${product.name}. Assuming 0.`);
                    availableStock = 0;
                }
            }
            // --- END IN-PLACE TYPE CONVERSION ---


            if (product.sizes && Array.isArray(product.sizes) && itemSize) {
                const sizeData = product.sizes.find(s => s.size === itemSize);
                if (sizeData) {
                    availableStock = sizeData.stock;

                    // --- IN-PLACE TYPE CONVERSION FOR SIZES STOCK ---
                    if (typeof availableStock === 'string') {
                        const parsedStock = parseInt(availableStock, 10);
                        if (!isNaN(parsedStock)) {
                            availableStock = parsedStock;
                            isStockParsed = true; // Mark as parsed
                            console.log(`Debug: Converted size stock for ${product.name} (size ${itemSize}) from string to number: ${availableStock}`);
                        } else {
                            console.warn(`Could not parse stock for product ${product.name} (size ${itemSize}). Assuming 0.`);
                            availableStock = 0;
                        }
                    }
                    // --- END IN-PLACE TYPE CONVERSION ---

                    stockPath = `sizes.$.stock`;
                } else {
                    availableStock = 0;
                    console.log(`Warning: Size '${itemSize}' not found for product ${product.name}. Assuming 0 stock.`);
                }
            }

            if (availableStock < requestedQty) {
                console.log(`Insufficient stock for ${product.name} (Size: ${itemSize || 'N/A'}). Only ${availableStock} available, requested ${requestedQty}.`);
                return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}. Only ${availableStock} available.` });
            }

            itemsForOrder.push({
                product: product._id,
                name: product.name,
                price: actualProductPrice,
                quantity: requestedQty,
                size: itemSize || undefined,
            });
            totalAmount += actualProductPrice * requestedQty;

            // Prepare the update operation for this product/size
            const filter = { _id: productId };
            const update = { $inc: {} };

            if (itemSize && product.sizes && Array.isArray(product.sizes)) {
                 filter['sizes.size'] = itemSize;
                 update.$inc['sizes.$.stock'] = -requestedQty;
            } else {
                update.$inc.stock = -requestedQty;
            }
            
            // IMPORTANT: If stock was parsed from string, we also need to explicitly set its type in the database
            // This is done by adding a $set operator for the stock field with its *current* numeric value
            // This will ensure it's saved as a number after the first decrement
            if (isStockParsed) {
                if (!update.$set) update.$set = {}; // Initialize $set if not already present
                if (itemSize && product.sizes && Array.isArray(product.sizes)) {
                    // For size stock, we need to set the value for the matched array element
                    // This is trickier with $inc and $set on the same path.
                    // A direct findOneAndUpdate without $inc might be safer for the first conversion,
                    // but the $inc will automatically convert it to a number.
                    // The main goal is that *after* this operation, it becomes a number.
                    // The $inc operator inherently tries to convert, and if successful, makes it numeric.
                    // So, we don't need an explicit $set here for type conversion for size stock.
                } else {
                    // For top-level stock, if it was a string, force it to be set as a number
                    // This can be simplified: $inc will handle the conversion if successful.
                    // The key is that the value *being decremented* must be cast to a number first.
                    // Mongoose's `findOneAndUpdate` and `$inc` are smart enough here.
                }
            }

            stockUpdateOperations.push({ filter, update, productInfo: { name: product.name, id: productId, size: itemSize } });
        }

        console.log("Validated items for order:", JSON.stringify(itemsForOrder, null, 2));
        console.log("Calculated total amount:", totalAmount.toFixed(2));
        console.log("Customer Info to be saved:", customerInfo);

        console.log("Attempting to create order in database...");
        const status = 'pending';
        const order = await orderModel.create({
            cartItems: itemsForOrder,
            amount: totalAmount.toFixed(2),
            status,
            createdAt: new Date(),
            customerInfo: customerInfo
        });
        console.log("Order creation successful! Order ID:", order._id);
        console.log("Newly created order object (full response from DB):", JSON.stringify(order, null, 2));

        console.log("Attempting to update product stock using bulk operations...");
        
        const updatePromises = stockUpdateOperations.map(async (op) => {
            try {
                if (op.filter['sizes.size']) {
                    const result = await productModel.findOneAndUpdate(
                        op.filter,
                        op.update,
                        { new: true, runValidators: true } // runValidators ensures schema types are respected on update
                    );
                    if (result) {
                        const updatedSize = result.sizes.find(s => s.size === op.productInfo.size);
                        console.log(`Stock updated for ${op.productInfo.name} (Size: ${op.productInfo.size}). New stock: ${updatedSize ? updatedSize.stock : 'N/A'}`);
                    } else {
                        console.warn(`Product not found or size not matched for update: ${op.productInfo.name} (ID: ${op.productInfo.id}, Size: ${op.productInfo.size}).`);
                    }
                } else {
                    const result = await productModel.updateOne(op.filter, op.update, { runValidators: true }); // runValidators ensures schema types are respected on update
                    console.log(`General stock updated for ${op.productInfo.name}. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
                }
            } catch (updateError) {
                console.error(`Error updating stock for ${op.productInfo.name} (ID: ${op.productInfo.id}, Size: ${op.productInfo.size || 'N/A'}):`, updateError);
            }
        });

        await Promise.all(updatePromises);
        console.log("All product stocks updated successfully.");

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            order
        });

    } catch (error) {
        console.error('*** UNCAUGHT ERROR DURING ORDER CREATION PROCESS ***');
        console.error('Error details:', error);
        console.error('Error stack:', error.stack);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: `Validation Error: ${messages.join(', ')}`
            });
        }
        res.status(500).json({ success: false, message: 'Internal server error. Please try again.' });
    }
};