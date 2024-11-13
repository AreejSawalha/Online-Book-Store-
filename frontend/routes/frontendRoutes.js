const express = require('express');
const router = express.Router();
const {
    searchItems,
    getItemInfo,
    purchaseController
} = require('../controllers/FrontendController');

router.post('/purchase/:item_number', purchaseController);
router.get('/search/:topic', searchItems);
router.get('/info/:item_number', getItemInfo);

module.exports = router;
