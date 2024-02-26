import React, { useState } from 'react';
import axios from 'axios';

const AddToCart = ({ userId, productId }) => {
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/cart/${userId}`, {
        productId,
        quantity
      });
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error("Failed to add product to cart:", error);
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
