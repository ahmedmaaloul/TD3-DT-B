const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS module

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const port = 2000;

app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce').then(() => {
  console.log("Connected to DB");
}).catch((e) => {
  console.log("Failed to connect\n", e);
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
