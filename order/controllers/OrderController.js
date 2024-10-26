const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} = require('../services/OrderService');

// Create a new order
exports.createOrder = (req, res) => {
  const { customer_name, total, items } = req.body;
  createOrder(customer_name, total, items, (err, orderId) => {
      if (err) {
          return res.status(500).json({ error: 'Error creating order' });
      }
      res.json({ message: 'Order created successfully', order_id: orderId });
  });
};

// Get all orders
exports.getAllOrders = (req, res) => {
  getAllOrders((err, data) => {
      if (err) {
          return res.status(500).send(err.message);
      }
      res.json(data);
  });
};

// Get a single order by ID
exports.getOrderById = (req, res) => {
  const orderId = req.params.order_id;
  getOrderById(orderId, (err, row) => {
      if (err) {
          return res.status(500).send("Error retrieving order data");
      }
      res.json(row);
  });
};

// Update an order
exports.updateOrder = (req, res) => {
  const orderId = req.params.order_id;
  const { total, items } = req.body;
  updateOrder(orderId, total, items, (err) => {
      if (err) {
          return res.status(500).send("Error updating order");
      }
      res.send("Order updated successfully");
  });
};

// Delete an order
exports.deleteOrder = (req, res) => {
  const orderId = req.params.order_id;
  deleteOrder(orderId, (err) => {
      if (err) {
          return res.status(500).send("Error deleting order");
      }
      res.send("Order deleted successfully");
  });
};




/*const axios = require('axios');
const OrderService = require('../services/OrderService');
const CATALOG_SERVICE_URL = 'http://<catalog_vm_ip>:5001';

exports.purchase = async (req, res) => {
  const itemNumber = req.params.item_number;
  try {
    const response = await axios.get(`${CATALOG_SERVICE_URL}/query/item/${itemNumber}`);
    const item = response.data;
    
    if (item.stock > 0) {
      await axios.put(`${CATALOG_SERVICE_URL}/update/${itemNumber}`, { stock: item.stock - 1, price: item.price });
      OrderService.logOrder(itemNumber, (err) => {
        if (err) return res.status(500).send("Error logging order");
        res.send("Purchase successful");
      });
    } else {
      res.status(400).send("Item out of stock");
    }
  } catch (error) {
    res.status(500).send("Error processing purchase");
  }
};*/
