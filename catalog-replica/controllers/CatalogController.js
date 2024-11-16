const {
    queryByTopic,
    queryByItem,
    updateItem,
    deleteItem,
    getAllItems
} = require('../services/CatalogService');

exports.queryByTopic = (req, res) => {
    const topic = req.params.topic;
    queryByTopic(topic, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        console.log(data);
        res.json(data);
    });
};

exports.getAllItemsController = (req, res) => {
    getAllItems((err, data) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(data);
    });
};

exports.queryByItem = (req, res) => {
    const itemNumber = req.params.item_number;
    queryByItem(itemNumber, (err, row) => {
        if (err) {
            return res.status(500).send("Error retrieving item data");
        }
        res.json(row);
    });
};

exports.updateItem = (req, res) => {
    const itemNumber = req.params.item_number;
    const { stock, price } = req.body;
    updateItem(itemNumber, stock, price, (err) => {
        if (err) {
            return res.status(500).send("Error updating item data");
        }
        res.send("Item updated successfully");
    });
};

exports.deleteItem = (req, res) => {
    const itemNumber = req.params.item_number;
    deleteItem(itemNumber, (err) => {
        if (err) {
            return res.status(500).send("Error deleting item");
        }
        res.send("Item deleted successfully");
    });
};






