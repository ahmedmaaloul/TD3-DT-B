import React, { useState } from 'react';
import axios from 'axios';

const AddToCart = ({ userId, productId }) => {
  const [quantity, setQuantity] = useState(1);
  
  // Define your primary and secondary API URLs
  const PRIMARY_API_URL = 'http://localhost:2020/cart/';
  const SECONDARY_API_URL = 'http://localhost:2000/cart/';

  const addToCart = async (url) => {
    try {
      await axios.post(`${url}${userId}`, {
        productId,
        quantity
      });
      alert('Product added to cart successfully!');
      return true; // Indicate success
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      return false; // Indicate failure
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Try adding to cart using the primary server
    const success = await addToCart(PRIMARY_API_URL);
    if (!success) {
      console.log('Trying secondary server...');
      await addToCart(SECONDARY_API_URL); // Attempt with the secondary server
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Quantity:
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" />
      </label>
      <button type="submit">Add to Cart</button>
    </form>
  );
};

export default AddToCart;
