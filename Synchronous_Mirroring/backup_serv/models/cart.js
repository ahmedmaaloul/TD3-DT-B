const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection'); 

const Cart = sequelize.define('Cart', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  products: {
    type: DataTypes.JSON 
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  }
}, {
  timestamps: false
});

module.exports = Cart;
