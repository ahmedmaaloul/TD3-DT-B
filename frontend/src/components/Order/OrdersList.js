import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersList = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:2020/orders/${userId}`);
        const ordersWithDetails = await Promise.all(response.data.map(async (order) => {
          const productsWithDetails = await Promise.all(order.products.map(async (product) => {
            const productResponse = await axios.get(`http://localhost:2020/products/${product.productId}`);
            return {
              ...product,
              name: productResponse.data.name,
              price: productResponse.data.price,
            };
          }));
          return { ...order, products: productsWithDetails };
        }));
        setOrders(ordersWithDetails);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="container mt-4">
      <h2>Orders</h2>
      {orders.length > 0 ? (
        orders.map(order => (
          <div key={order._id} className="card mb-3">
            <div className="card-header">
              Order ID: {order._id}
            </div>
            <div className="card-body">
              <h5 className="card-title">Total Price: €{order.totalPrice}</h5>
              <p className="card-text">Status: {order.status}</p>
              <h6>Products</h6>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Product ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productId}</td>
                      <td>{item.name}</td>
                      <td>€{item.price}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : <p>No orders found.</p>}
    </div>
  );
};

export default OrdersList;
