const express = require('express');
const frontendRoutes = require('./routes/frontendRoutes');
const app = express();

app.use(express.json());
app.use('/', frontendRoutes);

app.listen(5000, () => {
  console.log('Frontend service running on port 5000');
});
