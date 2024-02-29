const Product = require('../models/product'); // Adjust the path to where your Sequelize models are defined

exports.getProducts = async (req, res) => {
  try {
    const { category, inStock } = req.query;
    let where = {};

    if (category) {
      where.category = category;
    }

    if (inStock) {
      where.stockStatus = inStock === 'true' ? { [Op.gt]: 0 } : 0; // Op.gt for greater than
    }

    const products = await Product.findAll({ where });
    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.json(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.createProduct = async (req, res) => {
  console.log(req.body)
  console.log(Product)
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const [updateCount, updatedProducts] = await Product.update(req.body, {
      where: { id: req.params.id },
      returning: true, // Needed for PostgreSQL to return the updated object
    });

    if (updateCount === 0) {
      return res.status(404).send('Product not found');
    }

    const updatedProduct = updatedProducts[0];
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleteCount = await Product.destroy({
      where: { id: req.params.id }
    });

    if (deleteCount === 0) {
      return res.status(404).send('Product not found');
    }

    res.send(`Product with id ${req.params.id} has been deleted.`);
  } catch (error) {
    res.status(500).send(error);
  }
};
