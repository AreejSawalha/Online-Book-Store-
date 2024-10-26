const express = require('express');
const catalogRouter = require('./routes/catalogRoutes'); 
const app = express();
const PORT = 5001;

app.use(express.json());
app.use('/catalog', catalogRouter); // Mount the catalog routes on /catalog

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
