const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection'); 

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  category: {
    type: DataTypes.STRING
  },
  stockStatus: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: false
});

module.exports = Product;
