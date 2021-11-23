/* eslint-disable react/prop-types */
import React, { useState, useEffect, useReducer } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import axios from 'axios';

// CUSTOM IMPORTS
// contexts and reducers
import {
  initialState,
  userReducer,
  addUser,
} from './reducers/UserReducer.js';
import UserContext from './contexts/UserContext.js';
// services and modules
import REACT_APP_BACKEND_URL from './modules/urls.mjs';
import localStorageService from './modules/localStorageService.mjs';
import './App.css';
// component partials
import Navbar from './components/Navbar/Navbar.jsx';
// auth pages
import Login from './components/Login/LoginPage.jsx';
import Register from './components/Register/RegisterPage.jsx';
// admin pages
import AdminIndex from './components/Admin/Index/IndexPage.jsx';
import AdminEdit from './components/Admin/Edit/EditPage.jsx';
import AdminOptimise from './components/Admin/Optimise/OptimisePage.jsx';
// worker pages
import WorkerIndex from './components/Worker/Index/IndexPage.jsx';
import WorkerEdit from './components/Worker/Edit/EditPage.jsx';
// other pages
import Error404 from './components/Error/Error404Page.jsx';

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
  const [user, dispatch] = useReducer(userReducer, initialState);
  const [hasNavbar, setHasNavbar] = useState(true);
  const [isAuthPage, setIsAuthPage] = useState(false);
  // const [, setIsJustLoggedOut] = useState(false);
  // const [username, setUsername] = useState(getCookie('username').trim());
  // const [realName, setRealName] = useState(getCookie('realName').trim().split('%20').join(' '));
  // const [userId, setUserId] = useState(Number(getCookie('userId').trim()));

  useEffect(() => {
    const token = localStorageService.getItem('token');
    const userId = localStorageService.getItem('user_id');
    const username = localStorageService.getItem('username');

    if (!token || !userId || !username) {
      localStorageService.removeItem('token');
      localStorageService.removeItem('user_id');
      localStorageService.removeItem('username');
    } else {
      dispatch(
        addUser({
          token,
          user_id: Number(userId),
          username,
        }),
      );
    }
  }, []);

  const handleLogoutSubmit = (event) => {
    event.preventDefault();

    axios
      .delete(`${REACT_APP_BACKEND_URL}/logout`)
      .then((response) => {
        if (response.data.error) {
          console.log('logout error:', response.data.error);
        } else {
          // setIsLoggedIn(false);
          // setIsJustLoggedOut(true);
          // setUsername('');
          // setRealName('');
          // setUserId(0);
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

  // const handleSetIsLoggedIn = () => {
  //   setIsLoggedIn(true);
  // };

  console.log('user in app:');
  console.log(user);

  return (
    <UserContext.Provider value={dispatch}>
      <Router>
        <Navbar
          // username={username}
          // userId={userId}
          // realName={realName}
          // isLoggedIn={isLoggedIn}
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
                <Register
                  user={user}
                  // isLoggedIn={isLoggedIn}
                />
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
                  user={user}
                  // isLoggedIn={isLoggedIn}
                  // handleSetIsLoggedIn={handleSetIsLoggedIn}
                  // setPrevUsername={setUsername}
                  // setPrevRealName={setRealName}
                  // setPrevUserId={setUserId}
                />
              </NavbarWrapper>
            )}
          />
          {/* WORKER ROUTES */}
          <Route
            exact
            path={['/worker', '/']}
            render={() => (
              <NavbarWrapper
                navbarForAuth={false}
                setIsAuthPage={setIsAuthPage}
                handleSetNavbar={handleSetNavbar}
              >
                <WorkerIndex />
              </NavbarWrapper>
            )}
          />
          <Route
            exact
            path="/workeredit"
            render={() => (
              <NavbarWrapper
                navbarForAuth={false}
                setIsAuthPage={setIsAuthPage}
                handleSetNavbar={handleSetNavbar}
              >
                <WorkerEdit />
              </NavbarWrapper>
            )}
          />
          {/* ADMIN ROUTES */}
          <Route
            exact
            path="/admin"
            render={() => (
              <NavbarWrapper
                navbarForAuth={false}
                setIsAuthPage={setIsAuthPage}
                handleSetNavbar={handleSetNavbar}
              >
                <AdminIndex />
              </NavbarWrapper>
            )}
          />
          <Route
            exact
            path="/adminoptimise"
            render={() => (
              <NavbarWrapper
                navbarForAuth={false}
                setIsAuthPage={setIsAuthPage}
                handleSetNavbar={handleSetNavbar}
              >
                <AdminOptimise />
              </NavbarWrapper>
            )}
          />
          <Route
            exact
            path="/adminedit"
            render={() => (
              <NavbarWrapper
                navbarForAuth={false}
                setIsAuthPage={setIsAuthPage}
                handleSetNavbar={handleSetNavbar}
              >
                <AdminEdit />
              </NavbarWrapper>
            )}
          />
          {/* ALL OTHERS */}
          <Route
            exact
            path="*"
            render={() => (
              <NavbarWrapper
                navbarForAuth={false}
                setIsAuthPage={setIsAuthPage}
                handleSetNavbar={handleSetNavbar}
              >
                <Error404 />
              </NavbarWrapper>
            )}
          />
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}
