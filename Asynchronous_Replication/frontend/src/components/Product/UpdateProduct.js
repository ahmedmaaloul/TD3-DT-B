import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const UpdateProduct = ({ productId }) => {
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockStatus: 0,
  });
  const primaryBaseUrl = 'http://localhost:2020';
  const secondaryBaseUrl = 'http://localhost:2000';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${primaryBaseUrl}/products/${productId}`);
        setProductDetails(response.data);
      } catch (primaryError) {
        console.error("Failed to fetch product from primary server:", primaryError);
        try {
          const secondaryResponse = await axios.get(`${secondaryBaseUrl}/products/${productId}`);
          setProductDetails(secondaryResponse.data);
        } catch (secondaryError) {
          console.error("Failed to fetch product from secondary server:", secondaryError);
        }
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
      await axios.put(`${primaryBaseUrl}/products/${productId}`, productDetails);
      alert('Product updated successfully!');
    } catch (primaryError) {
      console.error("Failed to update product on primary server:", primaryError);
      try {
        await axios.put(`${secondaryBaseUrl}/products/${productId}`, productDetails);
        alert('Product updated successfully on secondary server!');
      } catch (secondaryError) {
        console.error("Failed to update product on secondary server:", secondaryError);
      }
    }
  };

  return (
    <div className="container mt-3">
      <h2>Update Product</h2>
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
        <button type="submit" className="btn btn-primary">Update Product</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
