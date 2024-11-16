const db = require('../database');

const queryByTopic = (topic, callback) => {
    db.all("SELECT * FROM catalog WHERE topic = ?", [topic], (err, rows) => {
        if (err) {
            return callback(err);
        }
        callback(null, rows); 
    });
};

const queryByItem = (item_number, callback) => {
    db.get("SELECT * FROM catalog WHERE item_number = ?", [item_number], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, row);
    });
};

const updateItem = (item_number, stock, price, callback) => {
    db.run("UPDATE catalog SET stock = ?, price = ? WHERE item_number = ?", [stock, price, item_number], function(err) {
        if (err) {
            return callback(err);
        }
        callback(null, this.changes); 
    });
};

const deleteItem = (item_number, callback) => {
    db.run("DELETE FROM catalog WHERE item_number = ?", [item_number], function(err) {
        if (err) {
            return callback(err);
        }
        callback(null, this.changes); // Return the number of deleted rows
    });
};

const getAllItems = (callback) => {
    db.all(`SELECT * FROM catalog`, [], (err, rows) => {
        if (err) {
            callback(err, null); 
        } else {
            callback(null, rows); 
        }
    });
};

module.exports = { queryByTopic, queryByItem, updateItem, deleteItem, getAllItems };
