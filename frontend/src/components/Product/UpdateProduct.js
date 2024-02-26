// UpdateProduct.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpdateProduct = ({ productId }) => {
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockStatus: 0,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${productId}`);
        setProductDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch product for update:", error);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleChange = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/products/${productId}`, productDetails);
      alert('Product updated successfully!');
      // Reset form or handle post-update logic here
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={productDetails.name} onChange={handleChange} placeholder="Name" />
      <input name="description" value={productDetails.description} onChange={handleChange} placeholder="Description" />
      <input name="price" type="number" value={productDetails.price} onChange={handleChange} placeholder="Price" />
      <input name="category" value={productDetails.category} onChange={handleChange} placeholder="Category" />
      <input name="stockStatus" type="number" value={productDetails.stockStatus} onChange={handleChange} placeholder="Stock Status" />
      <button type="submit">Update Product</button>
    </form>
  );
};

export default UpdateProduct;
