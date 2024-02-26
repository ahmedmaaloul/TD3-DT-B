const Product = require('../models/product');

exports.getProducts = async (req, res) => {
  try {
    let query = {};
    const { category, inStock } = req.query;

    if (category) {
      query.category = category;
    }

    if (inStock) {
      const stockStatus = inStock === 'true' ? { $gt: 0 } : 0; // $gt: 0 for inStock items, 0 for out of stock
      query.stockStatus = stockStatus;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.json(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).send('Product not found');
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).send('Product not found');
    }
    res.send(`Product with id ${req.params.id} has been deleted.`);
  } catch (error) {
    res.status(500).send(error);
  }
};
