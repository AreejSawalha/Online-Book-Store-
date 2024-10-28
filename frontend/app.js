const express = require('express');
const frontendRoutes = require('./routes/frontendRoutes');
const app = express();
const bodyParser = require('body-parser');


app.use(express.json());
app.use('/', frontendRoutes);

const PORT = 3000; // Defined PORT for the application

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.listen(PORT, () => {
  console.log(`Frontend service running on port ${PORT}`);
});
