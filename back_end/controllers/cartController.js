const Cart = require('../models/cart');
const Product = require('../models/product'); // Adjust the path to where your Product model is defined

const getProductPriceById = async (productId) => {
  try {
    const product = await Product.findById(productId).exec(); // Use exec() for a fully-fledged promise
    if (!product) {
      console.log(`Product with ID ${productId} not found`);
      return null; // Or throw an error as per your error handling strategy
    }
    return product.price;
  } catch (error) {
    console.error(`Error fetching product price for ID ${productId}:`, error);
    throw error; // Rethrow or handle as per your error handling strategy
  }
};
// Assuming you have a method to get product price by ID

exports.addToCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    let productPrice = await getProductPriceById(req.body.productId); // Fetch the product price
    console.log(req.body)
    if (!cart) {
      let totalPrice = productPrice * req.body.quantity;
      cart = new Cart({
        userId: req.params.userId,
        products: [req.body],
        totalPrice: totalPrice,
      });
    } else {
      // Add new product or update existing product quantity
      const index = cart.products.findIndex(p => p.productId === req.body.productId);
      if (index > -1) {
        cart.products[index].quantity += req.body.quantity;
        cart.totalPrice += productPrice * req.body.quantity; // Update total price
      } else {
        cart.products.push(req.body);
        cart.totalPrice += productPrice * req.body.quantity; // Update total price
      }
    }
    const updatedCart = await cart.save();
    res.status(201).json(updatedCart);
  } catch (error) {
    res.status(400).send(error);
  }
};


exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      // If no cart found, create a new empty cart for the user
      cart = new Cart({
        userId: req.params.userId,
        products: [], // Initialize with an empty array
        totalPrice: 0 // Initialize total price as 0
      });
      await cart.save(); // Save the new cart to the database
    }
    res.json(cart);
  } catch (error) {
    console.error("Error fetching or creating cart:", error);
    res.status(500).send(error);
  }
};

exports.deleteItemFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).send('Cart not found');
    }
    // Find the product to remove and its price
    const productIndex = cart.products.findIndex(p => p.productId === req.params.productId);
    if (productIndex > -1) {
      let productPrice = await getProductPriceById(req.params.productId); // Fetch the product price
      let productToRemove = cart.products[productIndex];
      cart.totalPrice -= productPrice * productToRemove.quantity; // Update total price
      cart.products.splice(productIndex, 1); // Remove the product
    }
    
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Add this function to your cartController.js

exports.clearCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    let cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).send('Cart not found');
    }
    
    // Clear the products array and reset the total price
    cart.products = [];
    cart.totalPrice = 0;
    
    await cart.save(); // Save the updated cart

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error("Failed to clear cart:", error);
    res.status(500).send(error);
  }
};

