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
      await axios.post('http://localhost:2020/products', productDetails);
      alert('Product created successfully!');
      // Optionally, reset form fields after successful creation
      setProductDetails({
        name: '',
        description: '',
        price: '',
        category: '',
        stockStatus: 0,
      });
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" value={productDetails.name} onChange={handleChange} placeholder="Name" />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" className="form-control" id="description" name="description" value={productDetails.description} onChange={handleChange} placeholder="Description" />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input type="number" className="form-control" id="price" name="price" value={productDetails.price} onChange={handleChange} placeholder="Price" />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input type="text" className="form-control" id="category" name="category" value={productDetails.category} onChange={handleChange} placeholder="Category" />
        </div>
        <div className="mb-3">
          <label htmlFor="stockStatus" className="form-label">Stock Status</label>
          <input type="number" className="form-control" id="stockStatus" name="stockStatus" value={productDetails.stockStatus} onChange={handleChange} placeholder="Stock Status" />
        </div>
        <button type="submit" className="btn btn-primary">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
