const db = require('../database');
const axios = require('axios');

//
const sqlite3 = require('sqlite3').verbose();

// Connect to the primary database
const dbPrimary = new sqlite3.Database('./orders.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to the primary database:', err.message);
    } else {
        console.log('Connected to the primary database.');
    }
});

// Connect to the replica database
const dbReplica = new sqlite3.Database('./order_replica1.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to the replica database:', err.message);
    } else {
        console.log('Connected to the replica database.');
    }
});


//
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
/*const updateOrder = (order_id, total, items, callback) => {
    db.run(`UPDATE orders SET total = ?, items = ? WHERE order_id = ?`,
        [total, items, order_id], function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, this.changes); 
        });
};*/
const updateOrder = (order_id, total, items, callback) => {
    const query = `UPDATE orders SET total = ?, items = ? WHERE order_id = ?`;
    const params = [total, items, order_id];

    // Update primary database
    db.run(query, params, function (err) {
        if (err) {
            return callback(err);
        }
        console.log(`Primary database updated: ${this.changes} rows affected`);

        // Send update to replica service
        axios.put(`http://localhost:5005/order/update/${order_id}`, { total, items })
        .then(response => {
            console.log('Replica service response:', response.data);
            callback(null, this.changes);
        })
        .catch(error => {
            console.error('Replica service error:', error.response?.data || error.message);
            callback(error);
        });

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



