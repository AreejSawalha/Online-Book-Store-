const axios = require('axios');
const CATALOG_SERVICE_URL = 'http://<catalog_vm_ip>:5001';
const ORDER_SERVICE_URL = 'http://<order_vm_ip>:5002';

exports.search = async (req, res) => {
  try {
    const response = await axios.get(`${CATALOG_SERVICE_URL}/query/topic/${req.params.topic}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error retrieving data');
  }
};

exports.info = async (req, res) => {
  try {
    const response = await axios.get(`${CATALOG_SERVICE_URL}/query/item/${req.params.item_number}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error retrieving item info');
  }
};

exports.purchase = async (req, res) => {
  try {
    const response = await axios.post(`${ORDER_SERVICE_URL}/purchase/${req.params.item_number}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error processing purchase');
  }
};
