/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';

function NavbarButtons({ isLoggedIn, isAuthPage, handleLogoutSubmit }) {
  if (isLoggedIn && !isAuthPage) {
    return (
      <form
        className="d-inline-block"
      >
        <button
          className="btn btn-danger"
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
      <Link className="btn btn-success" to="/login" role="button">Log In</Link>
    );
  }

  return null;
}

export default function Navbar({
  isLoggedIn, isAuthPage, hasNavbar, handleLogoutSubmit,
}) {
  if (hasNavbar) {
    return (
      <>
        <nav className="navbar navbar-dark bg-dark fixed-top">
          <div className="container-fluid">
            <div className="row w-100">
              <div className="col-3" />
              <div className="col-9 text-end">
                <NavbarButtons
                  isLoggedIn={isLoggedIn}
                  isAuthPage={isAuthPage}
                  handleLogoutSubmit={handleLogoutSubmit}
                />
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }
  return null;
}
