const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db'); // Specify your database file
const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 }); // Cache with TTL of 60 seconds
const orderService = require('../services/frontedservice');

module.exports = db; // Export the db instance

// Define your primary and replica URLs
const primaryCatalog = 'http://localhost:5001';
const catalogReplicas = [
    'http://localhost:5009',  // Replica 1
    
];

// Helper function to get a catalog URL (alternates between primary and replicas)
const getCatalogUrl = () => {
    // Randomly pick from primary or replicas
    const catalogs = [primaryCatalog, ...catalogReplicas];
    const randomIndex = Math.floor(Math.random() * catalogs.length);
    return catalogs[randomIndex];
};

// Function to handle search requests with caching and load distribution
const searchItems = (req, res) => {
    const { topic } = req.params;
    const cacheKey = `search_${topic}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log('Serving from cache:', cacheKey);
        return res.json(cachedData);
    }

    // Helper function to fetch data from catalog
    const fetchCatalogData = async () => {
        try {
            const catalogUrl = getCatalogUrl(); // Get a catalog URL (either primary or replica)
            console.log(`Attempting to fetch from catalog: ${catalogUrl}`);
            const response = await axios.get(`${catalogUrl}/catalog/query/topic/${topic}`);
            console.log(`Fetched from catalog: ${catalogUrl}`);
            return response.data;
        } catch (error) {
            console.log('Catalog error:', error.message);
            throw new Error('Unable to fetch data from any catalog service.');
        }
    };

    // Fetch the data from catalogs
    fetchCatalogData()
        .then((responseData) => {
            cache.set(cacheKey, responseData); // Store in cache
            res.json(responseData);
            console.log('Fetched and cached successfully:', responseData);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
            console.error('Error in search request:', error.message);
        });
};

// Function to handle item info requests with caching and load distribution
const getItemInfo = async (req, res) => {
    const { item_number } = req.params;
    const cacheKey = `info_${item_number}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log('Serving from cache:', cacheKey);
        return res.json(cachedData);
    }

    // Helper function to fetch item information
    const fetchItemInfo = async () => {
        try {
            const catalogUrl = getCatalogUrl(); // Get a catalog URL (either primary or replica)
            console.log(`Attempting to fetch item info from catalog: ${catalogUrl}`);
            const response = await axios.get(`${catalogUrl}/catalog/query/item/${item_number}`);
            console.log(`Fetched item info from catalog: ${catalogUrl}`);
            return response.data;
        } catch (error) {
            console.log('Catalog error:', error.message);
            throw new Error('Unable to fetch item information from any catalog service.');
        }
    };

    try {
        const itemInfo = await fetchItemInfo();
        cache.set(cacheKey, itemInfo); // Store in cache
        res.json(itemInfo);
        console.log('Fetched and cached item info successfully:', itemInfo);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching item info' });
        console.error('Error fetching item info:', error.message);
    }
};

// Purchase controller function
const purchaseController = async (req, res) => {
    const itemNumber = req.params.item_number;
    console.log(`Item number received for purchase: ${itemNumber}`);

    try {
        const result = await orderService.purchaseItem(itemNumber);
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




/*const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db'); // Specify your database file
const axios = require('axios');
const http = require('http');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 }); // Cache with TTL of 60 seconds
const orderService = require('../services/frontedservice');

module.exports = db; // Export the db instance

// Function to handle search requests with caching
const searchItems = (req, res) => {
    const { topic } = req.params;
    const cacheKey = `search_${topic}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log('Serving from cache:', cacheKey);
        return res.json(cachedData);
    }

    try {
        http.get(`http://localhost:5001/catalog/query/topic/${topic}`, (response) => {
            let dataChunks = [];

            response.on("data", (chunk) => dataChunks.push(chunk));
            response.on("end", () => {
                const responseData = JSON.parse(Buffer.concat(dataChunks).toString());
                cache.set(cacheKey, responseData); // Store in cache
                res.json(responseData);
                console.log('Fetched and cached successfully:', responseData);
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

// Function to handle info requests with caching
const getItemInfo = async (req, res) => {
    const { item_number } = req.params;
    const cacheKey = `info_${item_number}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log('Serving from cache:', cacheKey);
        return res.json(cachedData);
    }

    try {
        const response = await axios.get(`http://localhost:5001/catalog/query/item/${item_number}`);
        cache.set(cacheKey, response.data); // Store in cache
        res.json(response.data);
        console.log('Fetched and cached successfully:', response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching item info' });
        console.error('Error fetching item info:', error.message);
    }
};

// Purchase controller function
const purchaseController = async (req, res) => {
    const itemNumber = req.params.item_number;
    console.log(`Item number received for purchase: ${itemNumber}`);

    try {
        const result = await orderService.purchaseItem(itemNumber);
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
*/