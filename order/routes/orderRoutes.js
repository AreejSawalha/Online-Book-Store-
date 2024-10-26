const express = require('express');
const {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require('../controllers/OrderController');

const router = express.Router();



// Define routes for handling orders
router.post('/create', createOrder);        // POST: Create a new order
router.get('/list', getAllOrders);          // GET: Get all orders
router.get('/:order_id', getOrderById);     // GET: Get order by ID
router.put('/update/:order_id', updateOrder); // PUT: Update an existing order
router.delete('/delete/:order_id', deleteOrder); // DELETE: Delet
// Define routes for orders
/*router.post('/order', createOrder);
router.get('/orders', getAllOrders);
router.get('/order/:order_id', getOrderById);
router.put('/order/:order_id', updateOrder);
router.delete('/order/:order_id', deleteOrder);*/

module.exports = router;
