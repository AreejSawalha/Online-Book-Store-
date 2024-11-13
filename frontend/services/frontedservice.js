const axios = require('axios');
const { createOrder } = require('C:/Users/user/Pictures/DOS/ProjectDosPart2/Online-Book-Store-/order/services/OrderService.js');

const purchaseItem = async (itemNumber) => {
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
};

module.exports = {
    purchaseItem
};
