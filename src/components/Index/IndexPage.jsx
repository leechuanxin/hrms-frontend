/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
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
    <div className="container pt-5 pb-5">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1">
          <h1 className="text-center">Dummy Index Page</h1>
        </div>
      </div>
    </div>
  );
}
