const express = require('express');
const { search, info, purchase } = require('../controllers/FrontendController');
const router = express.Router();

router.get('/search/:topic', search);
router.get('/info/:item_number', info);
router.post('/purchase/:item_number', purchase);

module.exports = router;
