const db = require('../database');

// Create a new order
const createOrder = (customer_name, total, items, callback) => {
    const orderDate = new Date().toISOString(); 
    db.run(`INSERT INTO orders (customer_name, order_date, total, items) VALUES (?, ?, ?, ?)`,
        [customer_name, orderDate, total, items], function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, this.lastID); 
        });
};

// Get all orders
const getAllOrders = (callback) => {
    db.all(`SELECT * FROM orders`, [], (err, rows) => {
        if (err) {
            return callback(err);
        }
        callback(null, rows);
    });
};

// Get an order by ID
const getOrderById = (order_id, callback) => {
    db.get(`SELECT * FROM orders WHERE order_id = ?`, [order_id], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, row);
    });
};

// Update an existing order
const updateOrder = (order_id, total, items, callback) => {
    db.run(`UPDATE orders SET total = ?, items = ? WHERE order_id = ?`,
        [total, items, order_id], function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, this.changes); 
        });
};

// Delete an order
const deleteOrder = (order_id, callback) => {
    db.run(`DELETE FROM orders WHERE order_id = ?`, [order_id], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, this.changes); 
    });
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder };
