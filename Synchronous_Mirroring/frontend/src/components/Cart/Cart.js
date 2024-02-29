import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = ({ userId }) => {
  const [cart, setCart] = useState({ products: [] });

  // Define primary and secondary API URLs
  const PRIMARY_API_URL = 'http://localhost:2020/cart/';
  const SECONDARY_API_URL = 'http://localhost:2000/cart/';

  const handleApiRequest = async (requestFunction, fallbackUrl, additionalSuccessLogic) => {
    try {
      const response = await requestFunction(PRIMARY_API_URL);
      additionalSuccessLogic(response);
    } catch (error) {
      console.error("Primary server failed:", error);
      try {
        const response = await requestFunction(fallbackUrl);
        additionalSuccessLogic(response);
      } catch (error) {
        console.error("Secondary server failed:", error);
      }
    }
  };

  useEffect(() => {
    handleApiRequest(
      url => axios.get(`${url}${userId}`),
      SECONDARY_API_URL,
      response => setCart(response.data)
    );
  }, [userId]);

  const removeItemFromCart = async (productId) => {
    handleApiRequest(
      url => axios.delete(`${url}${userId}/item/${productId}`),
      SECONDARY_API_URL,
      () => setCart(currentCart => ({...currentCart, products: currentCart.products.filter(item => item.productId !== productId)}))
    );
  };

  const validateCartAsOrder = async () => {
    handleApiRequest(
      url => axios.post(`${url.replace('/cart/', '/orders')}`, {
        userId,
        products: cart.products,
      }),
      SECONDARY_API_URL.replace('/cart/', '/orders'),
      response => {
        alert(`Order ${response.data._id} created successfully!`);
        setCart({ products: [], totalPrice: 0 });
        // Clear the cart after successful order creation, attempt on primary, then secondary if needed
        handleApiRequest(
          clearUrl => axios.delete(`${clearUrl}clear/${userId}`),
          SECONDARY_API_URL,
          () => {}
        );
      }
    );
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
