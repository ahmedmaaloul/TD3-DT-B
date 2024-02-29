const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./db/connection'); // Adjust this path as needed

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    sequelize.sync({ force: false }).then(() => console.log('Models synchronized with the database.')).catch(err => console.error('Failed to synchronize models:', err));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testDatabaseConnection();
const app = express();
const port = 2000;

app.use(cors());
app.use(express.json());

// No need to manually connect like mongoose, Sequelize does this in the connection file

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
