/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
// Custom imports
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import * as successes from '../../modules/successes.mjs';
import * as errors from '../../modules/errors.mjs';
import localStorageService from '../../modules/localStorageService.mjs';
import UserContext from '../../contexts/UserContext.js';
import { addUser } from '../../reducers/UserReducer.js';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function GlobalLoginErrorAlert({ errorMessage }) {
  if (errorMessage.trim() !== '') {
    return (
      <div className="col-12">
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      </div>
    );
  }

  return null;
}

export default function LoginPage({
  sessionExpired,
}) {
  const dispatch = useContext(UserContext);
  const query = useQuery();
  const [globalErrorMessage, setGlobalErrorMessage] = useState(
    sessionExpired ? errors.SESSION_EXPIRED_ERROR_MESSAGE : '',
  );

  const [username, setUsername] = useState(query.get('username') || '');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    // Retrieve input field value from JS event object.
    const inputName = event.target.value;
    // Log input field value to verify what we typed.
    setUsername(inputName);
  };

  const handlePasswordChange = (event) => {
    // Retrieve input field value from JS event object.
    const inputName = event.target.value;
    // Log input field value to verify what we typed.
    setPassword(inputName);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      username,
      password,
    };

    axios
      .post(`${REACT_APP_BACKEND_URL}/api/login/`, data)
      .then((response) => {
        const newData = {
          ...response.data,
        };
        localStorageService.setItem('token', response.data.token);
        localStorageService.setItem('user_id', response.data.user_id);
        localStorageService.setItem('username', response.data.username);
        dispatch(addUser({ ...newData }));
        // setPrevUsername(response.data.username);
        // setPrevRealName(response.data.realName);
        // setPrevUserId(response.data.id);
        // handleSetIsLoggedIn();
      })
      .catch(() => {
        // handle error
        window.scrollTo(0, 0);
        setGlobalErrorMessage(errors.LOGIN_GLOBAL_ERROR_MESSAGE);
      });
  };

  return (
    <div className="container-fluid pt-5">
      <div className="row w-100 pt-3">
        <div className="col-12 py-3">
          <form>
            <div className="row">
              <div className="col-12">
                <h3 className="mb-3 index-header font-bold text-lg">Log In</h3>
              </div>
              <div className="col-12">
                <p className="mb-3">
                  Do not have an account yet? Register
                  {' '}
                  <Link to="/signup">here</Link>
                  .
                </p>
              </div>
              <RegisterSuccessAlert
                success={query.get('registersuccess')}
                error={globalErrorMessage.trim() !== ''}
              />
              <GlobalLoginErrorAlert errorMessage={globalErrorMessage} />
              <div className="col-12 mb-3">
                <label htmlFor="userName">
                  <strong>Username</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="userName"
                  name="username"
                  placeholder="e.g. chee_kean"
                  value={username}
                  onChange={handleUsernameChange}
                />
                <div className="invalid-feedback text-red-300" />
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="password">
                  <strong>Password</strong>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <div className="invalid-feedback text-red-300" />
              </div>
            </div>
            <hr className="mb-4" />
            <button
              className="btn btn-primary btn-lg btn-block"
              type="submit"
              onClick={handleSubmit}
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function RegisterSuccessAlert({ success, error }) {
  if (success === 'true' && !error) {
    return (
      <div className="col-12">
        <div className="alert alert-success" role="alert">
          {successes.LOGIN_REGISTER_SUCCESS_MESSAGE}
        </div>
      </div>
    );
  }

  return null;
}
