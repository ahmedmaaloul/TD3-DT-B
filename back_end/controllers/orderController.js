const Order = require('../models/order');

exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order({
      ...req.body,
      status: 'Pending', // Default status, could be dynamic based on the implementation
      totalPrice: 0 // Initialize with 0, calculate based on product prices and quantities in a real application
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    if (!orders) {
      return res.status(404).send('No orders found');
    }
    res.json(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};
