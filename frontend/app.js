const express = require('express');
const frontendRoutes = require('./routes/frontendRoutes');
const app = express();

app.use(express.json());
app.use('/', frontendRoutes);

const PORT = 3000; // Defined PORT for the application
app.listen(PORT, () => {
  console.log(`Frontend service running on port ${PORT}`);
});
