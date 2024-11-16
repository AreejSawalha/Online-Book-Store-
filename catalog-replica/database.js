// database.js
const sqlite3 = require('sqlite3').verbose();

const catalogDb = new sqlite3.Database('./catalog.db', (err) => {
    if (err) {
        console.error('Error opening database: ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Create catalog table and insert sample data
        catalogDb.serialize(() => {
            catalogDb.run(`CREATE TABLE IF NOT EXISTS catalog (
                item_number INTEGER PRIMARY KEY,
                title TEXT,
                stock INTEGER,
                price REAL,
                topic TEXT
            )`, (err) => {
                if (err) {
                    console.error('Error creating table: ' + err.message);
                } else {
                    console.log('Catalog table created or already exists.');
                    insertSampleData();
                }
            });
        });
    }
});

const insertSampleData = () => {
    const sampleData = [
        { item_number: 1, title: 'Distributed Systems', stock: 10, price: 29.99, topic: 'Computer Science' },
        { item_number: 2, title: 'Database Management', stock: 15, price: 39.99, topic: 'Computer Engineering' },
        { item_number: 3, title: 'Artificial Intelligence', stock: 5, price: 49.99, topic: 'AI' },
        { item_number: 4, title: 'Web Development', stock: 8, price: 24.99, topic: 'Computer Science' },
        { item_number: 5, title: 'Machine Learning', stock: 12, price: 59.99, topic: 'AI' },
        { item_number: 6, title: 'Operating Systems', stock: 7, price: 34.99, topic: 'Computer Engineering' },
        { item_number: 7, title: 'Networking Basics', stock: 20, price: 19.99, topic: 'Networking' },
        { item_number: 8, title: 'Data Structures', stock: 10, price: 29.99, topic: 'Computer Science' },
        { item_number: 9, title: 'Cybersecurity', stock: 6, price: 45.99, topic: 'Security' },
        { item_number: 10, title: 'Cloud Computing', stock: 4, price: 39.99, topic: 'Cloud Technology' },
        { item_number: 11, title: 'Deep Learning', stock: 8, price: 54.99, topic: 'AI' }
    ];

    const stmt = catalogDb.prepare(`INSERT OR IGNORE INTO catalog (item_number, title, stock, price, topic) VALUES (?, ?, ?, ?, ?)`);
    sampleData.forEach(data => {
        stmt.run(data.item_number, data.title, data.stock, data.price, data.topic, (err) => {
            if (err) {
                console.error('Error inserting data: ' + err.message);
            } else {
                console.log(`Inserted: ${data.title}`);
            }
        });
    });
    stmt.finalize();
};

// Close the database connection when done
process.on('exit', () => {
    catalogDb.close((err) => {
        if (err) {
            console.error('Error closing database: ' + err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
});

module.exports = catalogDb; // Export the db instance
