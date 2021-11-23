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

export default function RegisterPage({ user }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [globalErrorMessage, setGlobalErrorMessage] = useState('');
  const [usernameInvalidMessage, setUsernameInvalidMessage] = useState('');
  const [nameInvalidMessage, setNameInvalidMessage] = useState('');
  const [password1InvalidMessage, setPassword1InvalidMessage] = useState('');
  const [password2InvalidMessage, setPassword2InvalidMessage] = useState('');

  const [username, setUsername] = useState('');
  const [realname, setRealname] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const userExists = !!user;
  const userIdExists = userExists
    && (user.userId !== 0);
  const usernameExists = userExists && (user.username && user.username.trim() !== '');
  const userTokenExists = userExists && (user.token && user.token.trim() !== '');
  const isLoggedIn = user && userIdExists && usernameExists && userTokenExists;

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

  const handlePassword1Change = (event) => {
    // Retrieve input field value from JS event object.
    const inputName = event.target.value;
    // Log input field value to verify what we typed.
    setPassword1(inputName);
  };

  const handlePassword2Change = (event) => {
    // Retrieve input field value from JS event object.
    const inputName = event.target.value;
    // Log input field value to verify what we typed.
    setPassword2(inputName);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let usernameInvalid = '';
    let nameInvalid = '';
    let password1Invalid = '';
    let password2Invalid = '';

    const data = {
      realName: realname,
      username,
      password1,
      password2,
    };

    axios
      .post(`${REACT_APP_BACKEND_URL}/api/dj-rest-auth/registration`, data)
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

            if (response.data.password1_invalid) {
              password1Invalid = response.data.password1_invalid;
            }

            if (response.data.password2_invalid) {
              password2Invalid = response.data.password2_invalid;
            }
          }

          setUsernameInvalidMessage(usernameInvalid);
          setNameInvalidMessage(nameInvalid);
          setPassword1InvalidMessage(password1Invalid);
          setPassword2InvalidMessage(password2Invalid);
          setGlobalErrorMessage(errors.REGISTER_GLOBAL_ERROR_MESSAGE);
        } else {
          setIsRegistered(true);
        }
      })
      .catch(({ response }) => {
        // handle error
        window.scrollTo(0, 0);
        setGlobalErrorMessage(errors.REGISTER_GLOBAL_ERROR_MESSAGE);
        if (
          response.data.non_field_errors
          && response.data.non_field_errors[0].indexOf('password') !== -1
        ) {
          [password1Invalid] = response.data.non_field_errors;
          [password2Invalid] = response.data.non_field_errors;
        }

        if (response.data.password1) {
          password1Invalid = `${password1Invalid} ${response.data.password1.join(' ')}`;
        }

        if (response.data.password2) {
          password2Invalid = `${password2Invalid} ${response.data.password2.join(' ')}`;
        }

        if (response.data.real_name) {
          nameInvalid = `${nameInvalid} ${response.data.real_name.join(' ')}`;
        }

        if (response.data.username) {
          usernameInvalid = `${usernameInvalid} ${response.data.username.join(' ')}`;
        }

        setUsernameInvalidMessage(usernameInvalid);
        setNameInvalidMessage(nameInvalid);
        setPassword1InvalidMessage(password1Invalid);
        setPassword2InvalidMessage(password2Invalid);
      });
  };

  if (isRegistered) {
    return (
      <Redirect push to={`/login?registersuccess=true&username=${username}`} />
    );
  }

  if (isLoggedIn) {
    return <Redirect to="/" />;
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
                <label htmlFor="password1">
                  <strong className="text-blue-50">Enter your password</strong>
                </label>
                <input
                  type="password"
                  className={
                    `form-control${
                      password1InvalidMessage.trim() !== '' ? ' is-invalid' : ''
                    }`
                  }
                  id="password1"
                  name="password1"
                  value={password1}
                  onChange={handlePassword1Change}
                />
                <div className="invalid-feedback text-red-300">{password1InvalidMessage}</div>
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="password2">
                  <strong className="text-blue-50">Please re-enter your password</strong>
                </label>
                <input
                  type="password"
                  className={
                    `form-control${
                      password2InvalidMessage.trim() !== '' ? ' is-invalid' : ''
                    }`
                  }
                  id="password2"
                  name="password2"
                  value={password2}
                  onChange={handlePassword2Change}
                />
                <div className="invalid-feedback text-red-300">{password2InvalidMessage}</div>
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
