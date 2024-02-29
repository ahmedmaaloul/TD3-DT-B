import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersList = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const primaryServer = 'http://localhost:2020';
  const secondaryServer = 'http://localhost:2000';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${primaryServer}/orders/${userId}`);
        setOrders(await processOrders(response.data));
      } catch (primaryError) {
        console.error("Failed to fetch orders from primary server:", primaryError);
        try {
          const secondaryResponse = await axios.get(`${secondaryServer}/orders/${userId}`);
          setOrders(await processOrders(secondaryResponse.data));
        } catch (secondaryError) {
          console.error("Failed to fetch orders from secondary server:", secondaryError);
        }
      }
    };

    const processOrders = async (ordersData) => {
      return Promise.all(ordersData.map(async (order) => {
        const productsWithDetails = await Promise.all(order.products.map(async (product) => {
          try {
            const productResponse = await axios.get(`${primaryServer}/products/${product.productId}`);
            return {
              ...product,
              name: productResponse.data.name,
              price: productResponse.data.price,
            };
          } catch {
            try {
              const secondaryProductResponse = await axios.get(`${secondaryServer}/products/${product.productId}`);
              return {
                ...product,
                name: secondaryProductResponse.data.name,
                price: secondaryProductResponse.data.price,
              };
            } catch (error) {
              console.error("Failed to fetch product details from both servers for productId:", product.productId, error);
              return product; // Return the product without additional details as a fallback
            }
          }
        }));
        return { ...order, products: productsWithDetails };
      }));
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="container mt-4">
      <h2>Orders</h2>
      {orders.length > 0 ? (
        orders.map(order => (
          <div key={order._id} className="card mb-3">
            <div className="card-header">Order ID: {order._id}</div>
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
