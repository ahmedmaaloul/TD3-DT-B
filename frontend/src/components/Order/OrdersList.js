import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersList = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/orders/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div>
      <h2>Orders</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map(order => (
            <li key={order._id}>
              <strong>Order ID:</strong> {order._id}, <strong>Total Price:</strong> ${order.totalPrice}, <strong>Status:</strong> {order.status}
              <h4>Products</h4>
              {order.products.length > 0 ? (
                <ul>
                  {order.products.map((item, index) => (
                    <li key={index}>
                      <strong>Product ID:</strong> {item.productId}
                      , <strong>Name:</strong> {item.name || 'Product name not available'}
                      , <strong>Price:</strong> €{item.price || 'N/A'}
                      , <strong>Quantity:</strong> {item.quantity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>This order has no products listed.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrdersList;
