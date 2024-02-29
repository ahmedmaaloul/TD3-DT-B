const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection'); 

const Order = sequelize.define('Order', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  products: {
    type: DataTypes.JSON 
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  }
}, {
  timestamps: false
});

module.exports = Order;
