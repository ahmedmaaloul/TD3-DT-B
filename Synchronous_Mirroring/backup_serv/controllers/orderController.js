const Product= require('../models/product'); // Adjust the path to where your Sequelize models are defined
const Order= require('../models/order'); // Adjust the path to where your Sequelize models are defined

exports.createOrder = async (req, res) => {
  try {
    const { products, userId } = req.body;

    let totalPrice = 0;
    for (const item of products) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).send(`Product with ID ${item.productId} not found`);
      }
      totalPrice += product.price * item.quantity; // Add to total price
    }

    // Create and save the new order with the calculated total price
    const newOrder = await Order.create({
      userId,
      products, // Assuming JSON type for storing array of product objects
      totalPrice, // Use the calculated total price
      status: 'Pending',
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).send(error);
  }
};

exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.params.userId }
    });
    if (orders.length === 0) {
      return res.status(404).send('No orders found');
    }
    res.json(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};
