/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import axios from 'axios';

// CUSTOM IMPORTS
import { hasLoginCookie, getCookie } from './modules/cookie.mjs';
import REACT_APP_BACKEND_URL from './modules/urls.mjs';
import './App.css';
// component partials
import Navbar from './components/Navbar/Navbar.jsx';
// auth pages
import Index from './components/Index/IndexPage.jsx';
import Login from './components/Login/LoginPage.jsx';
import Register from './components/Register/RegisterPage.jsx';

// make sure that axios always sends the cookies to the backend server
axios.defaults.withCredentials = true;

function NavbarWrapper({
  navbarForAuth,
  setIsAuthPage,
  handleSetNavbar,
  children,
}) {
  useEffect(() => {
    handleSetNavbar();

    if (navbarForAuth) {
      setIsAuthPage(true);
    } else {
      setIsAuthPage(false);
    }
  }, [navbarForAuth]);

  return <>{children}</>;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(hasLoginCookie());
  const [hasNavbar, setHasNavbar] = useState(true);
  const [isAuthPage, setIsAuthPage] = useState(false);
  const [, setIsJustLoggedOut] = useState(false);
  const [username, setUsername] = useState(getCookie('username').trim());
  const [realName, setRealName] = useState(getCookie('realName').trim().split('%20').join(' '));
  const [userId, setUserId] = useState(Number(getCookie('userId').trim()));

  // need useEffect for this?

  const handleLogoutSubmit = (event) => {
    event.preventDefault();

    axios
      .delete(`${REACT_APP_BACKEND_URL}/logout`)
      .then((response) => {
        if (response.data.error) {
          console.log('logout error:', response.data.error);
        } else {
          setIsLoggedIn(false);
          setIsJustLoggedOut(true);
          setUsername('');
          setRealName('');
          setUserId(0);
        }
      })
      .catch((error) => {
        // handle error
        console.log('logout error:', error);
      });
  };

  const handleSetNavbar = () => {
    setHasNavbar(true);
  };

  const handleSetIsLoggedIn = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Navbar
        username={username}
        userId={userId}
        realName={realName}
        isLoggedIn={isLoggedIn}
        isAuthPage={isAuthPage}
        hasNavbar={hasNavbar}
        handleLogoutSubmit={handleLogoutSubmit}
      />
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        {/* give the route matching path in order of matching precedence */}
        <Route
          path="/signup"
          render={() => (
            <NavbarWrapper
              navbarForAuth
              setIsAuthPage={setIsAuthPage}
              handleSetNavbar={handleSetNavbar}
            >
              <Register isLoggedIn={isLoggedIn} />
            </NavbarWrapper>
          )}
        />
        <Route
          path="/login"
          render={() => (
            <NavbarWrapper
              navbarForAuth
              setIsAuthPage={setIsAuthPage}
              handleSetNavbar={handleSetNavbar}
            >
              <Login
                isLoggedIn={isLoggedIn}
                handleSetIsLoggedIn={handleSetIsLoggedIn}
                setPrevUsername={setUsername}
                setPrevRealName={setRealName}
                setPrevUserId={setUserId}
              />
            </NavbarWrapper>
          )}
        />
        <Route
          exact
          path="/"
          render={() => (
            <NavbarWrapper
              navbarForAuth={false}
              setIsAuthPage={setIsAuthPage}
              handleSetNavbar={handleSetNavbar}
            >
              <Index
                isLoggedIn={isLoggedIn}
              />
            </NavbarWrapper>
          )}
        />
      </Switch>
    </Router>
  );
}
