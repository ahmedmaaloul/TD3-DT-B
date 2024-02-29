const Cart = require('../models/cart');
const Product = require('../models/product'); // Adjust paths as needed
const { addToReplicationQueue } = require('../replicationQueue'); // Import the mirroring function

const getProductPriceById = async (productId) => {
  try {
    const product = await Product.findById(productId).exec();
    if (!product) {
      console.log(`Product with ID ${productId} not found`);
      return null;
    }
    return product.price;
  } catch (error) {
    console.error(`Error fetching product price for ID ${productId}:`, error);
    throw error;
  }
};

exports.addToCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    let productPrice = await getProductPriceById(req.body.productId);
    if (!cart) {
      let totalPrice = productPrice * req.body.quantity;
      cart = new Cart({
        userId: req.params.userId,
        products: [req.body],
        totalPrice: totalPrice,
      });
    } else {
      const index = cart.products.findIndex(p => p.productId === req.body.productId);
      if (index > -1) {
        cart.products[index].quantity += req.body.quantity;
        cart.totalPrice += productPrice * req.body.quantity;
      } else {
        cart.products.push(req.body);
        cart.totalPrice += productPrice * req.body.quantity;
      }
    }
    await cart.save();
    
    // Mirror operation to PostgreSQL
    await addToReplicationQueue('create', { userId: req.params.userId, products: cart.products, totalPrice: cart.totalPrice }, 'carts');

    res.status(201).json(cart);
  } catch (error) {
    console.error("Failed to add to cart:", error);
    res.status(400).send(error);
  }
};

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({
        userId: req.params.userId,
        products: [],
        totalPrice: 0
      });
      await cart.save();
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
    const productIndex = cart.products.findIndex(p => p.productId === req.params.productId);
    if (productIndex > -1) {
      let productPrice = await getProductPriceById(req.params.productId);
      cart.totalPrice -= productPrice * cart.products[productIndex].quantity;
      cart.products.splice(productIndex, 1);
    }
    await cart.save();

    // Mirror operation to PostgreSQL
    await addToReplicationQueue('update', { userId: req.params.userId, products: cart.products, totalPrice: cart.totalPrice }, 'carts');

    res.json(cart);
  } catch (error) {
    console.error("Failed to delete item from cart:", error);
    res.status(500).send(error);
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    let cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).send('Cart not found');
    }
    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    // Mirror operation to PostgreSQL
    await addToReplicationQueue('delete', { userId: userId }, 'carts/clear');

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error("Failed to clear cart:", error);
    res.status(500).send(error);
  }
};
