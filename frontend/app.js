const express = require('express');
const frontendRoutes = require('./routes/frontendRoutes');
const app = express();
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', frontendRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Frontend service running on port ${PORT}`);
});
