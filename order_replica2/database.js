// order/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./orders.db', (err) => {
    if (err) {
        console.error('Error opening database: ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');

        db.serialize(() => {
            // Create the 'orders' table if it doesn't exist
            db.run(`CREATE TABLE IF NOT EXISTS orders (
                order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_name TEXT,
                order_date TEXT,
                total REAL,
                items TEXT
            )`, (err) => {
                if (err) {
                    console.error('Error creating table: ' + err.message);
                } else {
                    console.log('Orders table created or already exists.');
                    insertSampleOrders();  // Optionally insert some sample data
                }
            });
        });
    }
});

// Insert sample data into the 'orders' table
const insertSampleOrders = () => {
    const sampleOrders = [
        { customer_name: 'John Doe', order_date: '2024-08-01', total: 100.50, items: 'Item1, Item2' },
        { customer_name: 'Jane Smith', order_date: '2024-08-02', total: 50.00, items: 'Item3' },
        { customer_name: 'Mark Johnson', order_date: '2024-08-03', total: 75.20, items: 'Item4, Item5' }
    ];

    const stmt = db.prepare(`INSERT INTO orders (customer_name, order_date, total, items) VALUES (?, ?, ?, ?)`);
    sampleOrders.forEach(order => {
        stmt.run(order.customer_name, order.order_date, order.total, order.items, (err) => {
            if (err) {
                console.error('Error inserting order: ' + err.message);
            } else {
                console.log(`Inserted order for: ${order.customer_name}`);
            }
        });
    });
    stmt.finalize();
};

// Close the database connection when the process exits
process.on('exit', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database: ' + err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
});

module.exports = db;
