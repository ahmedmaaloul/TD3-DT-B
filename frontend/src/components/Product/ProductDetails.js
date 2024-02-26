// ProductDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [productId]);
  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>€{product.price}</p>
      <p>{product.category}</p>
      <p>{product.stockStatus}</p>
    </div>
  );
};

export default ProductDetails;
