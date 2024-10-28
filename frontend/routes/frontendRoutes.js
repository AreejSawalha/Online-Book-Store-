const express = require('express');

const router = express.Router();
const {
    searchItems,
    getItemInfo,
    purchaseItem
} = require('../controllers/FrontendController'); // Import controller functions


router.get('/search/:topic', searchItems);
router.get('/info/:item_number', getItemInfo);


// Export the router
module.exports = router;
