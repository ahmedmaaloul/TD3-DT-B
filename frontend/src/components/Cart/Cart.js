import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = ({ userId }) => {
  const [cart, setCart] = useState({ products: [] });

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const removeItemFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/cart/${userId}/item/${productId}`);
      fetchCart(); // Refresh cart contents after removal
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {cart.products.map((item, index) => (
          <li key={index}>
            Product ID: {item.productId}, Quantity: {item.quantity}
            <button onClick={() => removeItemFromCart(item.productId)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total Price: ${cart.totalPrice}</p>
    </div>
  );
};

export default Cart;
