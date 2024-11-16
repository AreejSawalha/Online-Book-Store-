const express = require('express');
const {
    queryByTopic,
    queryByItem,
    updateItem,
    getAllItemsController,
    deleteItem
} = require('../controllers/CatalogController'); 

const router = express.Router();

// Define your routes using the router
router.get('/query/topic/:topic', queryByTopic);
router.get('/query/item/:item_number', queryByItem);
router.put('/update/:item_number', updateItem);
router.get('/items', getAllItemsController); 
router.delete('/item/:item_number', deleteItem); // Updated route for deleting an item

module.exports = router;
