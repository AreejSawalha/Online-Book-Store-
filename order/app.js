// order/app.js
const express = require('express');
const orderRouter = require('./routes/orderRoutes');  // Import the order routes
const app = express();
const PORT = 5002;  // Use a different port than the catalog service

app.use(express.json());
app.use('/order', orderRouter); // Mount the order routes on /order

app.listen(PORT, () => {
    console.log(`Order service is running on http://localhost:${PORT}`);
});




