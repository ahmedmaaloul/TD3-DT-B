import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [inStock, setInStock] = useState('');
  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...(category && { category }),
        ...(inStock && { inStock }),
      }).toString();

      const response = await axios.get(`http://localhost:3000/products?${queryParams}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [category, inStock]);

  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:3000/products/${productId}`);
        alert('Product deleted successfully!');
        fetchProducts(); // Refresh the list of products after deletion
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <div>
        <label>Category: </label>
        <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Enter category" />
      </div>
      <div>
        <label>In Stock: </label>
        <select value={inStock} onChange={e => setInStock(e.target.value)}>
          <option value="">All</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>

      <ul>
        {products.map(product => (
          <li key={product._id}>
            {product.name} - ${product.price}
            <button onClick={() => deleteProduct(product._id)}>Delete</button>
            <Link to={`/products/${product._id}`}>View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
