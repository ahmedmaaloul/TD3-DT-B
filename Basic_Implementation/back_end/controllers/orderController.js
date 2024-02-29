const Order = require('../models/order');

const Product = require('../models/product'); // Assuming you have a Product model

exports.createOrder = async (req, res) => {
  try {
    const { products, userId } = req.body;

    let totalPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId); // Fetch each product
      if (!product) {
        return res.status(404).send(`Product with ID ${item.productId} not found`);
      }
      totalPrice += product.price * item.quantity; // Add to total price
    }

    // Create and save the new order with the calculated total price
    const newOrder = new Order({
      userId,
      products,
      totalPrice, // Use the calculated total price
      status: 'Pending',
    });
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
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
