// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db'); // Specify your database file
const axios = require('axios');
const http = require('http');
const orderService = require('../services/frontedservice');
module.exports = db; // Export the db instance




// Function to handle search requests
const searchItems = (req, res) => {
    const { topic } = req.params;
    try {
        http.get(`http://localhost:5001/catalog/query/topic/${topic}`, (response) => {
            let dataChunks = [];

            response.on("data", (chunk) => dataChunks.push(chunk));
            response.on("end", () => {
                const responseData = JSON.parse(Buffer.concat(dataChunks).toString());
                res.json(responseData);
                console.log('Fetched successfully:', responseData);
            });

            response.on("error", (err) => {
                res.status(500).json({ error: 'Error fetching data from catalog service' });
                console.error('Error in response:', err);
            });
        }).on("error", (err) => {
            res.status(500).json({ error: 'Error connecting to catalog service' });
            console.error('Connection error:', err);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to handle info requests
const getItemInfo = async (req, res) => {
    const { item_number } = req.params;
    try {
        const response = await axios.get(`http://localhost:5001/catalog/query/item/${item_number}`);
        res.json(response.data);
        console.log('Fetched successfully:', response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching item info' });
        console.error('Error fetching item info:', error.message);
    }
};



const purchaseController = async (req, res) => {
    const itemNumber = req.params.item_number; 
    console.log(`Item number received for purchase: ${itemNumber}`);

    try {
        const result = await orderService.purchaseItem(itemNumber); // Call the service function
        res.json(result);
        console.log('Purchase successful:', result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
        console.error('Purchase error:', error.message);
    }
};




// Export the functions
module.exports = {
    searchItems,
    getItemInfo,
    purchaseController
   
};
