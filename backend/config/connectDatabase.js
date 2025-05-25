const mongoose = require('mongoose');

const connectDatabase = () => {
    // --- TEMPORARY: HARDCODED DATABASE URI FOR DEBUGGING ONLY ---
    // You MUST replace this with your actual, full MongoDB Atlas connection string.
    // Ensure the password (if it has a period '.') is URL-encoded as '%2E'.
    const hardcodedDbUri = 'mongodb+srv://nithiish495:9884973235@nithish.scg7e1e.mongodb.net/mini-ecommerce?retryWrites=true&w=majority&appName=Nithish';

    mongoose.connect(hardcodedDbUri) // Use the hardcoded URI here
        .then(() => {
            console.log(`MongoDB connected with server: ${mongoose.connection.host}`);
        })
        .catch((err) => {
            console.error("MongoDB connection error:", err);
            process.exit(1);
        });
};

module.exports = connectDatabase;
