/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */

import React, { useState } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
// Custom imports
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import * as errors from '../../modules/errors.mjs';

function GlobalRegisterErrorAlert({ errorMessage }) {
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

export default function RegisterPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [globalErrorMessage, setGlobalErrorMessage] = useState('');
  const [usernameInvalidMessage, setUsernameInvalidMessage] = useState('');
  const [nameInvalidMessage, setNameInvalidMessage] = useState('');
  const [passwordInvalidMessage, setPasswordInvalidMessage] = useState('');

  const [username, setUsername] = useState('');
  const [realname, setRealname] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    // Retrieve input field value from JS event object.
    const inputName = event.target.value;
    // Log input field value to verify what we typed.
    setUsername(inputName);
  };

  const handleRealnameChange = (event) => {
    // Retrieve input field value from JS event object.
    const inputName = event.target.value;
    // Log input field value to verify what we typed.
    setRealname(inputName);
  };

  const handlePasswordChange = (event) => {
    // Retrieve input field value from JS event object.
    const inputName = event.target.value;
    // Log input field value to verify what we typed.
    setPassword(inputName);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let usernameInvalid = '';
    let nameInvalid = '';
    let passwordInvalid = '';

    const data = {
      realName: realname,
      username,
      password,
    };

    axios
      .post(`${REACT_APP_BACKEND_URL}/signup`, data)
      .then((response) => {
        if (response.data.error) {
          window.scrollTo(0, 0);

          if (response.data.error === errors.REGISTER_INPUT_VALIDATION_ERROR_MESSAGE) {
            if (response.data.username_invalid) {
              usernameInvalid = response.data.username_invalid;
            }

            if (response.data.realname_invalid) {
              nameInvalid = response.data.realname_invalid;
            }

            if (response.data.password_invalid) {
              passwordInvalid = response.data.password_invalid;
            }
          }

          setUsernameInvalidMessage(usernameInvalid);
          setNameInvalidMessage(nameInvalid);
          setPasswordInvalidMessage(passwordInvalid);
          setGlobalErrorMessage(errors.REGISTER_GLOBAL_ERROR_MESSAGE);
        } else {
          setIsRegistered(true);
        }
      })
      .catch(() => {
        // handle error
        window.scrollTo(0, 0);
        setGlobalErrorMessage(errors.REGISTER_GLOBAL_ERROR_MESSAGE);
      });
  };

  if (isRegistered) {
    return (
      <Redirect push to={`/login?registersuccess=true&username=${username}`} />
    );
  }

  return (
    <div className="container-fluid pt-5">
      <div className="row w-100 pt-3">
        <div className="col-12 py-3">
          <form>
            <div className="row">
              <div className="col-12">
                <h3 className="mb-3 index-header font-bold text-lg">Register</h3>
              </div>
              <div className="col-12">
                <p className="mb-3 text-blue-50">
                  Already have an account? Log in
                  {' '}
                  <Link to="/login">here</Link>
                  .
                </p>
              </div>
              <GlobalRegisterErrorAlert errorMessage={globalErrorMessage} />
              <div className="col-12 mb-3">
                <label htmlFor="userName">
                  <strong>Username</strong>
                </label>
                <input
                  type="text"
                  className={
                    `form-control${
                      usernameInvalidMessage.trim() !== '' ? ' is-invalid' : ''
                    }`
                  }
                  id="userName"
                  name="username"
                  placeholder="e.g. chee_kean"
                  value={username}
                  onChange={handleUsernameChange}
                />
                <div className="invalid-feedback">{usernameInvalidMessage}</div>
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="realName">
                  <strong>Real Name</strong>
                </label>
                <input
                  type="text"
                  className={
                    `form-control${
                      nameInvalidMessage.trim() !== '' ? ' is-invalid' : ''
                    }`
                  }
                  id="realName"
                  name="realname"
                  placeholder="e.g. Chee Kean"
                  value={realname}
                  onChange={handleRealnameChange}
                />
                <div className="invalid-feedback text-red-300">{nameInvalidMessage}</div>
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="password">
                  <strong className="text-blue-50">Password</strong>
                </label>
                <input
                  type="password"
                  className={
                    `form-control${
                      passwordInvalidMessage.trim() !== '' ? ' is-invalid' : ''
                    }`
                  }
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <div className="invalid-feedback text-red-300">{passwordInvalidMessage}</div>
              </div>
            </div>
            <hr className="mb-4" />
            <button
              className="btn btn-primary btn-lg btn-block"
              type="submit"
              onClick={handleSubmit}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
