/* eslint-disable react/prop-types */
import React, { useState, useEffect, useReducer } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

// CUSTOM IMPORTS
// contexts and reducers
import {
  initialState,
  userReducer,
  addUser,
  deleteUser,
} from './reducers/UserReducer.js';
import UserContext from './contexts/UserContext.js';
// services and modules
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
import Index from './components/Index/IndexPage.jsx';
import Error404 from './components/Error/Error404Page.jsx';

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

  useEffect(() => {
    const token = localStorageService.getItem('token');
    const userId = localStorageService.getItem('user_id');
    const username = localStorageService.getItem('username');
    const organisationId = localStorageService.getItem('organisation_id');
    const role = localStorageService.getItem('role');

    if (!token || !userId || !username || !organisationId || !role) {
      localStorageService.removeItem('token');
      localStorageService.removeItem('user_id');
      localStorageService.removeItem('username');
      localStorageService.removeItem('organisation_id');
      localStorageService.removeItem('role');
      dispatch(deleteUser());
    } else {
      dispatch(
        addUser({
          token,
          user_id: Number(userId),
          username,
          organisation_id: Number(organisationId),
          role,
        }),
      );
    }
  }, []);

  const handleLogoutSubmit = (event) => {
    event.preventDefault();
    localStorageService.removeItem('token');
    localStorageService.removeItem('user_id');
    localStorageService.removeItem('username');
    localStorageService.removeItem('organisation_id');
    localStorageService.removeItem('role');
    dispatch(deleteUser());
  };

  const handleSetNavbar = () => {
    setHasNavbar(true);
  };

  return (
    <UserContext.Provider value={dispatch}>
      <Router>
        <Navbar
          user={user}
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
                />
              </NavbarWrapper>
            )}
          />
          {/* WORKER ROUTES */}
          <Route
            exact
            path="/worker"
            render={() => (
              <NavbarWrapper
                navbarForAuth={false}
                setIsAuthPage={setIsAuthPage}
                handleSetNavbar={handleSetNavbar}
              >
                <WorkerIndex
                  user={user}
                />
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
                <WorkerEdit
                  user={user}
                />
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
                <AdminIndex
                  user={user}
                />
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
                <AdminOptimise user={user} />
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
                <AdminEdit user={user} />
              </NavbarWrapper>
            )}
          />
          {/* ALL OTHERS */}
          <Route
            exact
            path="/"
            render={() => (
              <NavbarWrapper
                navbarForAuth={false}
                setIsAuthPage={setIsAuthPage}
                handleSetNavbar={handleSetNavbar}
              >
                <Index user={user} />
              </NavbarWrapper>
            )}
          />
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
