const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 5000; // Port for the load balancer

// Enable JSON parsing for incoming requests
app.use(express.json());

// List of replica URLs
const replicas = [
  'http://localhost:5005', // order_replica1
  'http://localhost:5006'  // order_replica2
];

let currentReplica = 0;

// Round-robin function to route requests to replicas
const getReplicaUrl = () => {
  const replica = replicas[currentReplica];
  currentReplica = (currentReplica + 1) % replicas.length;
  return replica;
};

// Middleware to forward requests to replicas
app.use('/order', async (req, res) => {
  const replicaUrl = `${getReplicaUrl()}/order${req.url}`;
  console.log(`Forwarding request to: ${replicaUrl}`);
  console.log(`Request method: ${req.method}`);
  console.log(`Request URL: ${req.url}`);

  // Only log the body for non-DELETE requests
  if (req.method !== 'DELETE') {
    console.log(`Request body:`, req.body);
  }

  try {
    const response = await axios({
      method: req.method,
      url: replicaUrl,
      data: req.method === 'DELETE' ? null : req.body, // Pass null for DELETE requests
      headers: req.headers
    });

    console.log(`Received response from replica: ${replicaUrl}`);
    console.log(`Response status: ${response.status}`);
    console.log(`Response data:`, response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Error details:", error.message);
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    } else {
      console.error("No response received from replica.");
    }
    res.status(500).json({ error: 'Error forwarding request to replica' });
  }
});


// Middleware to forward requests to replicas
/*app.use('/order', async (req, res) => {
   // const replicaUrl = getReplicaUrl() + req.url.replace('/order', ''); // Remove '/order' from the path
   // console.log(Forwarding request to: ${replicaUrl});
   // console.log(Original request URL: ${req.url});
   // console.log(Modified URL to forward: ${replicaUrl});
   const replicaUrl = getReplicaUrl() + '/order'+ req.url; // Keep /order in the path
   console.log(`Forwarding request to: ${replicaUrl}`);
   console.log(`Request method: ${req.method}`);
   console.log(`Request body:`, req.body);
    
    try {
      const response = await axios({
        method: req.method,
        url: replicaUrl,
        data: req.body,
        headers: req.headers
      });
      console.log(`Received response from replica: ${replicaUrl}`);
      console.log(`Response status: ${response.status}`);
      console.log(`Response data:, response.data`);
      res.status(response.status).send(response.data);
    } catch (error) {
      console.error("Error details:", error.message);
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
      } else {
        console.error("No response received from replica.");
      }
      res.status(500).json({ error: 'Error forwarding request to replica' });
    }
});*/


// Start the load balancer
app.listen(PORT, () => {
  console.log(`Load balancer running on http://localhost:${PORT}`);
}); 