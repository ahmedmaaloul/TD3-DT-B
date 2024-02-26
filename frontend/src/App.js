import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ProductList from '..components/Product/ProductList';
import AddToCart from '..components/Cart/AddToCart'; 
import Cart from '..components/Cart/Cart';
import CreateOrder from '.components/Order/CreateOrder';
import OrdersList from '.components/Order/OrdersList';

// Mock userId and productId for demonstration purposes
const userId = 'exampleUserId';
const productId = 'exampleProductId';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">View Products</Link>
            </li>
            <li>
              <Link to={`/add-to-cart/${productId}`}>Add to Cart</Link> {/* Example link, assuming productId is dynamic */}
            </li>
            <li>
              <Link to="/cart">View Cart</Link>
            </li>
            <li>
              <Link to="/create-order">Create Order</Link>
            </li>
            <li>
              <Link to="/orders">View Orders</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/products">
            <ProductList />
          </Route>
          <Route path={`/add-to-cart/:productId`}>
            <AddToCart userId={userId} productId={productId} /> {/* Simplified for demonstration */}
          </Route>
          <Route path="/cart">
            <Cart userId={userId} />
          </Route>
          <Route path="/create-order">
            <CreateOrder userId={userId} />
          </Route>
          <Route path="/orders">
            <OrdersList userId={userId} />
          </Route>
          <Route path="/">
            <h2>Welcome to our E-commerce Platform</h2>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};
// adding some comment

export default App;
