const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db'); // Specify your database file

// Ensure catalog table exists
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS catalog (
        item_number INTEGER PRIMARY KEY,
        stock INTEGER NOT NULL
    )`);
});

// Function to purchase an item from the catalog
const purchaseItem = (item_number) => {
    return new Promise((resolve, reject) => {
        // Step 1: Check if the item exists in the catalog
        const select_query = `SELECT stock FROM catalog WHERE item_number = ?`;
        db.get(select_query, [item_number], (err, row) => {
            if (err) {
                return reject({ status: 500, message: 'Error querying catalog: ' + err.message });
            }

            if (!row) {
                return reject({ status: 404, message: 'Item not found' });
            }

            // Step 2: Check stock availability
            if (row.stock > 0) {
                // Step 3: Insert order into the orders table
                const insert_query = `INSERT INTO orders (item_number) VALUES (?)`;
                db.run(insert_query, [item_number], function (err) {
                    if (err) {
                        return reject({ status: 500, message: 'Error inserting order: ' + err.message });
                    }

                    // Step 4: Update the stock in the catalog
                    const updatedStock = row.stock - 1;
                    const update_query = `UPDATE catalog SET stock = ? WHERE item_number = ?`;
                    db.run(update_query, [updatedStock, item_number], (err) => {
                        if (err) {
                            return reject({ status: 500, message: 'Error updating stock: ' + err.message });
                        }

                        resolve({ message: 'Purchase completed successfully' });
                    });
                });
            } else {
                reject({ status: 400, message: 'Item is sold out' });
            }
        });
    });
};
// Export the functions
module.exports = {
    purchaseItem
   
};
