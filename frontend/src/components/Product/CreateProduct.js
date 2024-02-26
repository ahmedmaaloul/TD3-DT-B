// CreateProduct.js
import React, { useState } from 'react';
import axios from 'axios';

const CreateProduct = () => {
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockStatus: 0,
  });

  const handleChange = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/products', productDetails);
      alert('Product created successfully!');
      // Reset form or redirect as needed
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Render input fields for product details */}
      <input name="name" value={productDetails.name} onChange={handleChange} placeholder="Name" />
      <input name="description" value={productDetails.description} onChange={handleChange} placeholder="Description" />
      <input name="price" type="number" value={productDetails.price} onChange={handleChange} placeholder="Price" />
      <input name="category" value={productDetails.category} onChange={handleChange} placeholder="Category" />
      <input name="stockStatus" type="number" value={productDetails.stockStatus} onChange={handleChange} placeholder="Stock Status" />
      <button type="submit">Create Product</button>
    </form>
  );
};

export default CreateProduct;
