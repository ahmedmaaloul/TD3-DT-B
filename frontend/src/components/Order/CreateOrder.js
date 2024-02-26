import React, { useState } from 'react';
import axios from 'axios';

const CreateOrder = ({ userId }) => {
  const [productDetails, setProductDetails] = useState({ productId: '', quantity: 1 });
  const [orderDetails, setOrderDetails] = useState({
    products: [],
    userId: userId,
  });

  const handleProductChange = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const addProductToOrder = () => {
    setOrderDetails({
      ...orderDetails,
      products: [...orderDetails.products, productDetails],
    });
    // Reset productDetails for next product addition
    setProductDetails({ productId: '', quantity: 1 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:2020/orders', orderDetails);
      alert(`Order created successfully with ID: ${response.data._id}`);
      // Reset form or redirect user as needed
      setOrderDetails({ products: [], userId: userId }); // Reset order details
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Product ID: </label>
        <input
          name="productId"
          value={productDetails.productId}
          onChange={handleProductChange}
          placeholder="Enter product ID"
        />
      </div>
      <div>
        <label>Quantity: </label>
        <input
          type="number"
          name="quantity"
          value={productDetails.quantity}
          onChange={handleProductChange}
          placeholder="Enter quantity"
          min="1"
        />
      </div>
      <button type="button" onClick={addProductToOrder}>Add Product</button>
      <br />
      <button type="submit">Submit Order</button>
      <div>
        <h3>Order Preview:</h3>
        {orderDetails.products.map((product, index) => (
          <p key={index}>Product ID: {product.productId}, Quantity: {product.quantity}</p>
        ))}
      </div>
    </form>
  );
};

export default CreateOrder;
