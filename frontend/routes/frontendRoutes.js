const express = require('express');

const router = express.Router();
const {
    searchItems,
    getItemInfo,
    purchaseController
} = require('../controllers/FrontendController'); // Import controller functions



// Define the purchase route
router.post('/purchase/:item_number', purchaseController);
router.get('/search/:topic', searchItems);
router.get('/info/:item_number', getItemInfo);


// Export the router
module.exports = router;
