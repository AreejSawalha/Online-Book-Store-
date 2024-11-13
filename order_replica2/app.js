// order/app.js
const express = require('express');
const orderRouter = require('./routes/orderRoutes');  // Import the order routes
const app = express();
const PORT = 5006;  // Use a different port than the catalog service

app.use(express.json());
app.use('/order', orderRouter); // Mount the order routes on /order

app.get('/list', (req, res) => {
    console.log("Received request for /list");
    // Sample response, replace with actual logic
    res.status(200).json({ message: "List of orders" });
  });


app.listen(PORT, () => {
    console.log(`Order service is running on http://localhost:${PORT}`);
});




