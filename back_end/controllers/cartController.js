const Cart = require('../models/cart');

exports.addToCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({
        userId: req.params.userId,
        products: [req.body],
        totalPrice: 0 // Initialize with 0, calculate based on product prices in a real application
      });
    } else {
      // Add new product or update existing product quantity
      const index = cart.products.findIndex(p => p.productId === req.body.productId);
      if (index > -1) {
        cart.products[index].quantity += req.body.quantity;
      } else {
        cart.products.push(req.body);
      }
      // Total price calculation should be updated based on product prices
    }
    const updatedCart = await cart.save();
    res.status(201).json(updatedCart);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).send('Cart not found');
    }
    res.json(cart);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteItemFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).send('Cart not found');
    }
    // Remove the product from the cart
    cart.products = cart.products.filter(p => p.productId !== req.params.productId);
    // Total price calculation should be updated based on product prices
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).send(error);
  }
};
