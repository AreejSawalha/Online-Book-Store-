const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

// Create or connect to a SQLite database file
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

const { createOrder } = require('C:/Users/ibtis/OneDrive/Desktop/DOJ3/Online-Book-Store-/order/services/OrderService.js');
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
//const { createOrder } = require('C:/Users/user/Pictures/DOS/ProjectDosPart2/Online-Book-Store-/order/services/OrderService.js');

const primaryCatalog = 'http://localhost:5001';


const catalogReplicas = [
    'http://localhost:5009'  // catalog_replica2
  ];


const purchaseItem = async (itemNumber) => {
    try {
        // Fetch the item information from the primary catalog
        const itemInfo = await axios.get(`${primaryCatalog}/catalog/query/item/${itemNumber}`);
        const { stock, price } = itemInfo.data;

        if (stock > 0) {
            const updatedStock = stock - 1;

            // Perform parallel updates to both primary and replica catalogs
            const catalogUpdatePrimary = axios.put(`${primaryCatalog}/catalog/update/${itemNumber}`, { stock: updatedStock, price });
            const catalogUpdateReplica = axios.put(`${catalogReplicas[0]}/catalog/update/${itemNumber}`, { stock: updatedStock, price });

            // Wait for both updates to complete
            const [primaryResponse, replicaResponse] = await Promise.all([catalogUpdatePrimary, catalogUpdateReplica]);

            // Print out the port used for each request
            console.log(`Primary catalog updated on port 5001:`, primaryResponse.data);
            console.log(`Replica catalog updated on port 5009:`, replicaResponse.data);

            // Verify stock in both primary and replica catalogs
            const verifyPrimary = await axios.get(`${primaryCatalog}/catalog/query/item/${itemNumber}`);
            const verifyReplica = await axios.get(`${catalogReplicas[0]}/catalog/query/item/${itemNumber}`);

            // Check if stock is correctly updated in both
            if (verifyPrimary.data.stock === updatedStock && verifyReplica.data.stock === updatedStock) {
                console.log('Stock successfully updated in both primary and replica.');

                // Create the order
                return new Promise((resolve, reject) => {
                    createOrder('Anonymous', price, [itemNumber], (err, orderId) => {
                        if (err) return reject({ status: 500, message: 'Error creating order' });
                        resolve({ message: 'Purchase successful', order_id: orderId });
                    });
                });
            } else {
                throw { status: 500, message: 'Stock update failed in one or both catalogs.' };
            }
        } else {
            throw { status: 400, message: 'Item is sold out' };
        }
    } catch (error) {
        console.error('Error during purchase:', error);
        throw { status: error.response?.status || 500, message: error.message };
    }
};

/*const purchaseItem = async (itemNumber) => {
    try {
        // Fetch the item information from the primary catalog
        const itemInfo = await axios.get(`http://localhost:5001/catalog/query/item/${itemNumber}`);
        const { stock, price } = itemInfo.data;

        if (stock > 0) {
            const updatedStock = stock - 1;

            // Update stock in both catalog services (primary and replica)
            const catalogUpdatePrimary = await axios.put(`http://localhost:5001/catalog/update/${itemNumber}`, { stock: updatedStock, price });
            const catalogUpdateReplica = await axios.put(`http://localhost:5009/catalog/update/${itemNumber}`, { stock: updatedStock, price });

            // Verify stock in both databases
            const verifyPrimary = await axios.get(`http://localhost:5001/catalog/query/item/${itemNumber}`);
            const verifyReplica = await axios.get(`http://localhost:5009/catalog/query/item/${itemNumber}`);

            // Check if stock is correctly updated in both
            if (verifyPrimary.data.stock === updatedStock && verifyReplica.data.stock === updatedStock) {
                console.log('Stock successfully updated in both catalog and replica.');

                // Create the order
                return new Promise((resolve, reject) => {
                    createOrder('Anonymous', price, [itemNumber], (err, orderId) => {
                        if (err) return reject({ status: 500, message: 'Error creating order' });
                        resolve({ message: 'Purchase successful', order_id: orderId });
                    });
                });
            } else {
                throw { status: 500, message: 'Stock update failed in one or both databases.' };
            }
        } else {
            throw { status: 400, message: 'Item is sold out' };
        }
    } catch (error) {
        throw { status: error.response?.status || 500, message: error.message };
    }
};  */ // nice 





/*const purchaseItem = async (itemNumber) => {
    try {
        const itemInfo = await axios.get(`http://localhost:5001/catalog/query/item/${itemNumber}`);
        const itemStock = itemInfo.data.stock;
        const itemPrice = itemInfo.data.price;

        if (itemStock > 0) {
            console.log(`Stock available for item ${itemNumber}: ${itemStock}`);
            const updatedStock = itemStock - 1;
            await axios.put(`http://localhost:5001/catalog/update/${itemNumber}`, { stock: updatedStock, price: itemPrice });
            console.log('Stock updated in catalog');

            return new Promise((resolve, reject) => {
                createOrder('Anonymous', itemPrice, [itemNumber], (err, orderId) => {
                    if (err) {
                        console.error('Error creating order:', err);
                        return reject({ status: 500, message: 'Error creating order' });
                    }
                    console.log('Order created successfully, orderId:', orderId);
                    resolve({ message: 'Purchase successful', order_id: orderId });
                });
            });
        } else {
            console.log(`Item ${itemNumber} is sold out`);
            throw { status: 400, message: 'Item is sold out' };
        }
    } catch (error) {
        throw { status: error.response?.status || 500, message: error.message };
    }
};*/

module.exports = {
    purchaseItem
};
