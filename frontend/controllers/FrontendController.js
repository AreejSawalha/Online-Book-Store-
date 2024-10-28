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
    const item_number = req.params.item_number;

    try {
        // Step 1: Check availability
        const availabilityResult = await new Promise((resolve, reject) => {
            const select_query = `SELECT stock FROM catalog WHERE item_number = ?`;
            db.get(select_query, [item_number], (err, row) => {
                if (err) {
                    return reject({ status: 500, message: 'Error querying catalog: ' + err.message });
                }
                if (!row) {
                    return reject({ status: 404, message: 'Item not found' });
                }
                resolve(row);
            });
        });

        if (availabilityResult.stock <= 0) {
            return res.status(400).json({ error: 'Item is sold out' });
        }

        // Step 2: Proceed with the purchase
        const result = await orderService.purchaseItem(item_number);
        res.json(result);

    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};



// Export the functions
module.exports = {
    searchItems,
    getItemInfo,
    purchaseController
   
};
