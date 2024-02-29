import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [inStock, setInStock] = useState('');
  const primaryBaseUrl = 'http://localhost:2020';
  const secondaryBaseUrl = 'http://localhost:2000';

  useEffect(() => {
    const queryParams = new URLSearchParams({
      ...(category && { category }),
      ...(inStock && { inStock }),
    }).toString();
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${primaryBaseUrl}/products?${queryParams}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products from primary server:", error);
        try {
          const secondaryResponse = await axios.get(`${secondaryBaseUrl}/products?${queryParams}`);
          setProducts(secondaryResponse.data);
        } catch (secondaryError) {
          console.error("Failed to fetch products from secondary server:", secondaryError);
        }
      }
    };

    fetchProducts();
  }, [category, inStock]);

  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${primaryBaseUrl}/products/${productId}`);
        alert('Product deleted successfully!');
        // Trigger re-fetch by resetting category or inStock state
        setCategory(category); 
      } catch (error) {
        console.error("Failed to delete product on primary server:", error);
        try {
          await axios.delete(`${secondaryBaseUrl}/products/${productId}`);
          alert('Product deleted successfully on secondary server!');
          setCategory(category);
        } catch (secondaryError) {
          console.error("Failed to delete product on secondary server:", secondaryError);
        }
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Products</h2>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">Category: </label>
        <input type="text" className="form-control" id="category" value={category} onChange={e => setCategory(e.target.value)} placeholder="Enter category" />
      </div>
      <div className="mb-3">
        <label htmlFor="inStock" className="form-label">In Stock: </label>
        <select className="form-select" id="inStock" value={inStock} onChange={e => setInStock(e.target.value)}>
          <option value="">All</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>

      <ul className="list-group">
        {products.map(product => (
          <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {product.name} - €{product.price}
              <Link to={`/products/${product._id}`} className="btn btn-primary btn-sm ms-2">View Details</Link>
            </span>
            <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
