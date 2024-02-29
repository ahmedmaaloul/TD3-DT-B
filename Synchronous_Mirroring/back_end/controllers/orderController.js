const Order = require('../models/order');
const Product = require('../models/product');
const { mirrorOperationToPostgres } = require('../mirrorOperations');

exports.createOrder = async (req, res) => {
  try {
    const { products, userId } = req.body;

    let totalPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).send(`Product with ID ${item.productId} not found`);
      }
      totalPrice += product.price * item.quantity;
    }

    const newOrder = new Order({
      userId,
      products,
      totalPrice,
      status: 'Pending',
    });
    await newOrder.save();

    // Mirror the create operation to PostgreSQL
    await mirrorOperationToPostgres('create', {
      userId,
      products,
      totalPrice,
      status: 'Pending'
    }, 'orders');

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).send(error);
  }
};

exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    if (!orders.length) {
      return res.status(404).send('No orders found');
    }

    // Assuming mirroring for read operations is not necessary
    res.json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).send(error);
  }
};
