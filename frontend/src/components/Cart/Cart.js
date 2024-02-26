import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = ({ userId }) => {
  const [cart, setCart] = useState({ products: [] });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:2020/cart/${userId}`);
        console.log(response.data)
        setCart(response.data);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, [userId]);

  const removeItemFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:2020/cart/${userId}/item/${productId}`);
      setCart(currentCart => ({...currentCart}));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const validateCartAsOrder = async () => {
    try {
      const response = await axios.post('http://localhost:2020/orders', {
        userId,
        products: cart.products,
      });
      alert(`Order ${response.data._id} created successfully!`);
      await axios.delete(`http://localhost:2020/cart/clear/${userId}`);
      setCart({ products: [], totalPrice: 0 });
    } catch (error) {
      console.error("Failed to validate cart as order:", error);
    }
  };

  return (
    <div className="container mt-3">
      <h2>Cart</h2>
      <div className="list-group">
        {cart.products.map((item, index) => (
          <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
            Product ID: {item.productId}, Quantity: {item.quantity}
            <button className="btn btn-danger btn-sm" onClick={() => removeItemFromCart(item.productId)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <p>Total Price: €{cart.totalPrice}</p>
        <button className="btn btn-primary" onClick={validateCartAsOrder}>Validate Cart as Order</button>
      </div>
    </div>
  );
};

export default Cart;
