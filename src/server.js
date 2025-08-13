//const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from "./middleware/rateLimiter.js";

import transactionsRoute from './routes/transactionsRoute.js';


dotenv.config();
// Initialize express app
const app = express();
if (process.env.NODE_ENV === "production") job.start();
// Middleware to handle CORS 
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;




app. use('/api/transactions', transactionsRoute);

// Start the server and initialize the database
initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on PORT:", PORT);
    });
});

