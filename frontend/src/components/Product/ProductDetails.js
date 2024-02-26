import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap CSS is imported in your project

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const { productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:2020/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [productId]);
  const userId = "exampleUserId";
  const addToCart = async () => {
    try {
      await axios.post(`http://localhost:2020/cart/${userId}`, {
        productId,
        quantity: 1
      });
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
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
