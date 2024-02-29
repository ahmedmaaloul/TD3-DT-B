const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('e_commerce_db', 'ecommerce_user', 'hello', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection


// Export the sequelize instance
module.exports = sequelize;
