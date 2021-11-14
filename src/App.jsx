import "./App.css";

import React, { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import axios from "axios";

import Cart from "./components/Cart.jsx";
import Items from "./components/Items.jsx";
import ItemDetail from "./components/ItemDetail.jsx";

// make sure that axios always sends the cookies to the backend server
axios.defaults.withCredentials = true;

const REACT_APP_BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:3004";

export default function App() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedItemIndex, setSelectedItem] = useState();

  useEffect(() => {
    axios.get(BACKEND_URL + "/items").then((result) => {
      console.log(result);
      setItems(result.data.items);
    });
  }, []);

  const onDeepLink = (itemIndex) => {
    setSelectedItem(itemIndex);
  };

  const addToCart = (item, quantity) => {
    const cartItem = { quantity, ...item };
    setCart([cartItem, ...cart]);
  };

  const emptyCart = () => {
    setCart([]);
  };

  const setItemDetail = (itemIndex) => {
    setSelectedItem(itemIndex);
  };

  const selectedItem = items[selectedItemIndex];

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <NavLink exact to="/" activeClassName="rr-selected-link">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink exact to="/cart" activeClassName="rr-selected-link">
              Cart({cart.length})
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="container">
        <h1 className="page-title">Wow Shopping!</h1>
        <div className="row">
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            {/* give the route matching path in order of matching precedence */}
            <Route path="/items/:id">
              <ItemDetail
                item={selectedItem}
                addToCart={addToCart}
                onDeepLink={onDeepLink}
              />
            </Route>
            <Route path="/cart">
              <Cart items={cart} emptyCart={emptyCart} />
            </Route>
            <Route path="/">
              <Items
                items={items}
                setItemDetail={setItemDetail}
                selectedItemIndex={selectedItemIndex}
              />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
