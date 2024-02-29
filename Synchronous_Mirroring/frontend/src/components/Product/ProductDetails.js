import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const { productId } = useParams();
  const primaryBaseUrl = 'http://localhost:2020';
  const secondaryBaseUrl = 'http://localhost:2000';
  const userId = "exampleUserId";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${primaryBaseUrl}/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product from primary server:", error);
        try {
          const responseSecondary = await axios.get(`${secondaryBaseUrl}/products/${productId}`);
          setProduct(responseSecondary.data);
        } catch (secondaryError) {
          console.error("Failed to fetch product from secondary server:", secondaryError);
        }
      }
    };

    fetchProduct();
  }, [productId]);

  const addToCart = async () => {
    try {
      await axios.post(`${primaryBaseUrl}/cart/${userId}`, {
        productId,
        quantity: 1
      });
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Failed to add product to cart on primary server:", error);
      try {
        await axios.post(`${secondaryBaseUrl}/cart/${userId}`, {
          productId,
          quantity: 1
        });
        alert(`${product.name} added to cart on secondary server!`);
      } catch (secondaryError) {
        console.error("Failed to add product to cart on secondary server:", secondaryError);
      }
    }
  };

  if (!product) return <div className="container mt-3">Loading...</div>;

  return (
    <div className="container mt-3">
      <h2 className="mb-3">{product.name}</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Price: €{product.price}</li>
            <li className="list-group-item">Category: {product.category}</li>
            <li className="list-group-item">Stock Status: {product.stockStatus > 0 ? 'In Stock' : 'Out of Stock'}</li>
          </ul>
          <div className="mt-3">
            <button className="btn btn-primary" onClick={addToCart}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
