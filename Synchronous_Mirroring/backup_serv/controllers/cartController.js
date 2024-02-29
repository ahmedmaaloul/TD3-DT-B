const Product = require('../models/product'); // Adjust the path to where your Sequelize models are defined
const Cart = require('../models/cart'); // Adjust the path to where your Sequelize models are defined

// This function remains conceptually similar but uses Sequelize's syntax
const getProductPriceById = async (productId) => {
  try {
    const product = await Product.findByPk(productId);
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
    let cart = await Cart.findOne({ where: { userId: req.params.userId } });
    let productPrice = await getProductPriceById(req.body.productId);
    
    if (!cart) {
      let totalPrice = productPrice * req.body.quantity;
      cart = await Cart.create({
        userId: req.params.userId,
        products: [req.body], // Assuming JSON type for products
        totalPrice: totalPrice,
      });
    } else {
      // Assuming products is stored as JSON type and needs manipulation as an array
      const products = cart.products;
      const index = products.findIndex(p => p.productId === req.body.productId);
      
      if (index > -1) {
        products[index].quantity += req.body.quantity;
      } else {
        products.push(req.body);
      }

      cart.totalPrice += productPrice * req.body.quantity; // Update total price
      cart.products = products; // Reassign the updated products array back to the cart
      await cart.save(); // Persist changes
    }

    res.status(201).json(cart);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ where: { userId: req.params.userId } });
    if (!cart) {
      cart = await Cart.create({
        userId: req.params.userId,
        products: [],
        totalPrice: 0,
      });
    }
    res.json(cart);
  } catch (error) {
    console.error("Error fetching or creating cart:", error);
    res.status(500).send(error);
  }
};

exports.deleteItemFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.params.userId } });
    if (!cart) {
      return res.status(404).send('Cart not found');
    }

    // Assuming JSON type for products
    const products = cart.products;
    const productIndex = products.findIndex(p => p.productId === req.params.productId);
    if (productIndex > -1) {
      let productPrice = await getProductPriceById(req.params.productId);
      products.splice(productIndex, 1); // Remove the product
      cart.totalPrice -= productPrice * products[productIndex].quantity; // Update total price
      cart.products = products;
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ where: { userId: userId } });
    if (!cart) {
      return res.status(404).send('Cart not found');
    }

    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error("Failed to clear cart:", error);
    res.status(500).send(error);
  }
};
