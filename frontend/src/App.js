import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import ProductList from './components/Product/ProductList';
import Cart from './components/Cart/Cart';
import CreateOrder from './components/Order/CreateOrder';
import OrdersList from './components/Order/OrdersList';
import ProductDetails from './components/Product/ProductDetails';
import CreateProduct from './components/Product/CreateProduct';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const App = () => {
  return (
    <BrowserRouter>
      <div className="container mt-3">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">Home</NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/products">Products</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/cart">Cart</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/products/create">Create Product</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/orders">Orders</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/create" element={<CreateProduct />} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart userId="exampleUserId" />} />
          <Route path="/orders" element={<OrdersList userId="exampleUserId" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

// Example Home component with simple e-commerce styling
const Home = () => (
  <div style={{ textAlign: 'center' }}>
    <h1>Welcome to Our E-Commerce Platform</h1>
    <p>Explore our products, manage your cart, and place orders.</p>
  </div>
);

export default App;
