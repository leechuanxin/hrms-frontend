/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import {
  Link, Redirect,
} from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import axios from 'axios';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../../modules/urls.mjs';
import getApiHeader from '../../../modules/api-headers.mjs';
// Custom Components
import Error404 from '../../Error/Error404Page.jsx';

function AdminIndexShiftSummary({ workers }) {
  if (workers.length === 0) {
    return null;
  }

  return (
    <div className="row">
      <div className="col-12 pt-3">
        <div className="row align-items-center">
          <div className="col-12">
            <h4 className="mb-0">
              Shift Summary
            </h4>
          </div>
        </div>
      </div>
      <div className="col-12"><hr /></div>
      <div className="col-12 pt-3">
        <span className="badge bg-success me-2">Healthy</span>
        <span className="badge bg-warning text-dark me-2">Running Short of Time</span>
        <span className="badge bg-danger me-2">Danger</span>
      </div>
      <div className="col-12 pt-3">
        <pre>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col">{' '}</th>
                  <th scope="col" className="text-center">Remaining Shifts</th>
                  <th scope="col" className="text-center">Remaining Leaves</th>
                </tr>
              </thead>
              <tbody>
                {
                workers.map((worker) => (
                  <tr key={worker.id}>
                    <td>{worker.realName}</td>
                    <td className={((worker.remainingShiftsStatus && worker.remainingShiftsStatus.trim() !== '') ? `table-${worker.remainingShiftsStatus} text-center` : 'text-center')}>
                      {worker.remainingShifts}
                    </td>
                    <td className={((worker.remainingLeavesStatus && worker.remainingLeavesStatus.trim() !== '') ? `table-${worker.remainingLeavesStatus} text-center` : 'text-center')}>
                      {worker.remainingLeaves}
                    </td>
                  </tr>
                ))
              }
              </tbody>
            </table>
          </div>
        </pre>
      </div>
    </div>
  );
}

export default function AdminIndexPage({ user }) {
  const [events, setEvents] = useState([]);

  const getNextMonthString = (date) => {
    const formatter = new Intl.DateTimeFormat('default', { month: 'long' });
    const nextMonthDateStr = formatter.format(date);
    return nextMonthDateStr;
  };
  const getMonthNumber = (date, type) => {
    const currentMonth = date.getMonth();
    const nextMonth = (currentMonth === 11) ? 0 : date.getMonth() + 1;
    const monthNumber = (type === 'next') ? nextMonth : currentMonth;
    return monthNumber;
  };
  const getNextMonthDate = (date) => {
    const nextMonthNumber = date.getMonth() + 1;
    const nextMonthDate = new Date(date.getFullYear(), nextMonthNumber, 1);
    return nextMonthDate;
  };
  const getYearNumber = (date, type) => {
    const currentMonth = date.getMonth();
    const nextMonth = (currentMonth === 11) ? 0 : date.getMonth() + 1;
    const yearNumber = (type === 'next' && nextMonth === 0) ? date.getFullYear() + 1 : date.getFullYear();
    return yearNumber;
  };
  const [nextMonthDate] = useState(getNextMonthDate(new Date('2021-11-30')));

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const [userId, setUserId] = useState(0);
  const [realName, setRealName] = useState('');
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const hasUserId = !!user && user.user_id;
    const data = {
      month: getMonthNumber(new Date('2021-11-30'), 'next'),
      year: getYearNumber(new Date('2021-11-30'), 'next'),
    };
    if (hasUserId) {
      axios
        .get(`${REACT_APP_BACKEND_URL}/api/admin/${user.user_id}/year/${data.year}/month/${data.month}/schedule`, data, getApiHeader(user.token))
        .then((response) => {
          if (response.data.role === 'admin') {
            const newEvents = [
              ...response.data.leaveDates,
              ...response.data.shiftDates,
            ];
            const rerenderedEvents = newEvents.map((event) => {
              if (event.extendedProps.type === 'shift') {
                return {
                  ...event,
                  classNames: [`shift-block-${Number(event.extendedProps.userId) % 50}`],
                };
              }

              return {
                ...event,
                classNames: ['leave-block'],
              };
            });
            setRealName(response.data.realName);
            setUserId(response.data.userId);
            setEvents([...rerenderedEvents]);
            setWorkers([...response.data.workers]);
            setIsAdmin(true);
            setIsLoading(false);
          } else {
            setIsAdmin(false);
            setIsLoading(false);
          }
        })
        .catch(() => {
          // handle error
          setIsAdmin(false);
          setIsLoading(false);
        });
    } else {
      setIsAdmin(false);
      setIsLoading(true);
    }
  }, [user]);

  const userExists = !!user;
  const userIdExists = userExists
    && !Number.isNaN(Number(user.user_id)) && (user.user_id !== 0);
  const usernameExists = userExists && (user.username && user.username.trim() !== '');
  const userTokenExists = userExists && (user.token && user.token.trim() !== '');
  const isLoggedIn = user && userIdExists && usernameExists && userTokenExists;

  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  if (isLoading) {
    return (
      <div className="container pt-5 pb-5">
        <div className="row w-100 pt-3">
          <div className="col-12 pt-1">
            <div>
              <p className="text-center">Loading ...</p>
              <div className="meter w-100">
                <span style={{ width: '98%' }} />
              </div>
            </div>
            {/* <div
            className="spinner-border mt-5" style={{ width: '5rem', height: '5rem' }} role="status">
              <span className="sr-only">Loading...</span>
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin && !isLoading) {
    return (
      <Error404 />
    );
  }

  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3 pb-5">
        <div className="col-12 pt-1 d-flex justify-content-center align-items-center">
          <div className="me-4">
            <span className="square-image-wrapper">
              <span className="square-image circle">
                <img alt={`${realName}`} src={`https://avatars.dicebear.com/api/croodles-neutral/${userId}.svg`} />
              </span>
            </span>
          </div>
          <div>
            <h3>{realName}</h3>
            <p className="mb-0 fade-text-color">
              <strong>Admin</strong>
            </p>
          </div>
        </div>
        <div className="col-12"><hr /></div>
        <div className="col-12 col-md-8">
          <div className="row">
            <div className="col-12 pt-1">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="mb-0">
                    Shift Overview ???
                    {' '}
                    {getNextMonthString(nextMonthDate)}
                    {' '}
                    {getYearNumber(new Date('2021-11-30'), 'next')}
                  </h4>
                </div>
                <div className="col-4  d-flex justify-content-end">
                  <Link className="link-button" to="/adminoptimise" role="button">Optimise</Link>
                </div>
              </div>
            </div>
            <div className="col-12"><hr /></div>
            <div className="col-12 pt-3">
              <span className="badge bg-dark me-2">Leaves</span>
            </div>
            <div className="col-12 pt-3">
              <pre>
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={events}
                  initialDate={nextMonthDate}
                  headerToolbar={false}
                />
              </pre>
            </div>
            <div className="col-12 d-md-none pt-3"><hr /></div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <AdminIndexShiftSummary workers={workers} />
        </div>
      </div>
    </div>
  );
}
