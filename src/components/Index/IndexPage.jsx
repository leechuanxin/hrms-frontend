/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
import { Redirect } from 'react-router-dom';
import WorkerIndex from '../Worker/Index/IndexPage.jsx';
import AdminIndex from '../Admin/Index/IndexPage.jsx';

export default function IndexPage({ user }) {
  if (user && user.role === 'worker') {
    return (
      <WorkerIndex
        user={user}
      />
    );
  }

  if (user && user.role === 'admin') {
    return (
      <AdminIndex
        user={user}
      />
    );
  }

  return (
    <Redirect to="/login" />
  );
}
