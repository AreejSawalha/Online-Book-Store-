const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db'); // Specify your database file
const axios = require('axios');
const { createOrder } = require('C:/Users/ibtis/OneDrive/Desktop/DOSproj2/Online-Book-Store-/order/services/OrderService.js');
// Ensure catalog table exists
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS catalog (
        item_number INTEGER PRIMARY KEY,
        stock INTEGER NOT NULL
    )`);
});

/*const purchaseItem = (item_number) => {
    return new Promise((resolve, reject) => {
        const select_query = `SELECT stock FROM catalog WHERE item_number = ?`;
        
        db.get(select_query, [item_number], (err, row) => {
            if (err) {
                return reject({ status: 500, message: 'Error querying catalog: ' + err.message });
            }

            if (!row) {
                console.log(`Item not found for item_number: ${item_number}`);
                return reject({ status: 404, message: 'Item not found' });
            }

            if (row.stock > 0) {
                const insert_query = `INSERT INTO orders (item_number) VALUES (?)`;
                
                db.run(insert_query, [item_number], function (err) {
                    if (err) {
                        return reject({ status: 500, message: 'Error inserting order: ' + err.message });
                    }

                    const updatedStock = row.stock - 1;
                    const update_query = `UPDATE catalog SET stock = ? WHERE item_number = ?`;

                    db.run(update_query, [updatedStock, item_number], (err) => {
                        if (err) {
                            return reject({ status: 500, message: 'Error updating stock: ' + err.message });
                        }

                        resolve({
                            message: 'Purchase successful',
                            order_id: this.lastID
                        });
                    });
                });
            } else {
                reject({ status: 400, message: 'Item is sold out' });
            }
        });
    });
};*/

const purchaseItem = async (itemNumber) => {
    try {
        // Fetch item information from catalog service
        const itemInfo = await axios.get(`http://localhost:5001/catalog/query/item/${itemNumber}`);
        const itemStock = itemInfo.data.stock; // Adjust based on actual response structure
        const itemPrice = itemInfo.data.price; // Assuming price is also returned

        if (itemStock > 0) {
            console.log(`Stock available for item ${itemNumber}: ${itemStock}`);

            // Reduce stock and update catalog
            const updatedStock = itemStock - 1;
            await axios.put(`http://localhost:5001/catalog/update/${itemNumber}`, { stock: updatedStock, price: itemPrice });
            console.log('Stock updated in catalog');

            // Log the order using createOrder function
            createOrder('Anonymous', itemPrice, [itemNumber], (err, orderId) => {
                if (err) {
                    console.error('Error creating order:', err);
                    throw { status: 500, message: 'Error creating order' };
                }
                console.log('Order created successfully, orderId:', orderId);
                return { message: 'Purchase successful, order_id:' };
                res.json({ message: 'Purchase successful', order_id: orderId });
                throw { status: 200, message: 'Purchase successful' };
            });
        } else {
            console.log(`Item ${itemNumber} is sold out`);
            throw { status: 400, message: 'Item is sold out' };
        }
    } catch (error) {
        throw { status: error.status || 500, message: error.message };
    }
};





// Export the functions
module.exports = {
    purchaseItem
   
};
