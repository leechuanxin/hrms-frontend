/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, CloseButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function NavbarButtons({
  isLoggedIn, isAuthPage, handleLogoutSubmit,
}) {
  if (isLoggedIn && !isAuthPage) {
    return (
      <form
        className="d-inline-block"
      >
        <button
          type="submit"
          onClick={handleLogoutSubmit}
        >
          Log Out
        </button>
      </form>
    );
  }

  if (!isAuthPage) {
    return (
      <Link className="link-button" to="/login" role="button">Log In</Link>
    );
  }

  return null;
}

export default function Navbar({
  user, isAuthPage, hasNavbar, handleLogoutSubmit,
}) {
  const userExists = !!user;
  const userIdExists = userExists
    && !Number.isNaN(Number(user.user_id)) && (user.user_id !== 0);
  const usernameExists = userExists && (user.username && user.username.trim() !== '');
  const userTokenExists = userExists && (user.token && user.token.trim() !== '');
  const isLoggedIn = user && userIdExists && usernameExists && userTokenExists;
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffCanvas = () => setShowOffcanvas(false);
  const handleShowOffCanvas = (e) => {
    e.preventDefault();
    setShowOffcanvas(true);
  };

  if (hasNavbar) {
    return (
      <>
        <nav className="navbar navbar-dark bg-dark fixed-top">
          <div className="container-fluid">
            <div className="row w-100">
              <div className="col-3">
                <a
                  className="navbar-menu"
                  href="/show-offcanvas"
                  role="button"
                  onClick={handleShowOffCanvas}
                >
                  <FontAwesomeIcon icon={faBars} />
                </a>

              </div>
              <div className="col-9 d-flex justify-content-end align-items-center">
                <NavbarButtons
                  isLoggedIn={isLoggedIn}
                  isAuthPage={isAuthPage}
                  handleLogoutSubmit={handleLogoutSubmit}
                />
              </div>
            </div>
          </div>
        </nav>
        <Offcanvas className="text-white bg-dark" show={showOffcanvas} onHide={handleCloseOffCanvas}>
          <Offcanvas.Header>
            <Offcanvas.Title>HRMS</Offcanvas.Title>
            <CloseButton variant="white" onClick={handleCloseOffCanvas} />
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="d-flex flex-column">
              <ul className={`offcanvas-body-top nav nav-pills flex-column mb-auto${isLoggedIn ? ' is-logged-in' : ''}`}>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/" aria-current="page" onClick={handleCloseOffCanvas}>Home</Link>
                </li>
              </ul>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }
  return null;
}
