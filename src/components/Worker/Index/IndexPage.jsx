/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import axios from 'axios';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../../modules/urls.mjs';
import getApiHeader from '../../../modules/api-headers.mjs';
// Custom Components
import Error404 from '../../Error/Error404Page.jsx';

// make sure that axios always sends the cookies to the backend server
axios.defaults.withCredentials = true;

function WorkerIndexAlert({
  hasOptimisedSchedule, getMonthString, getYearString, nextMonthDate,
}) {
  if (!hasOptimisedSchedule) {
    return null;
  }
  return (
    <div className="col-12 pt-1">
      <div className="alert alert-warning d-flex align-items-center justify-content-center" role="alert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'none' }}
        >
          <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
          </symbol>
          <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
          </symbol>
          <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </symbol>
        </svg>
        <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
          <use xlinkHref="#exclamation-triangle-fill" />
        </svg>
        <div>
          Workers&apos; shift schedule for
          {' '}
          {getMonthString(nextMonthDate)}
          {' '}
          {getYearString(nextMonthDate)}
          {' '}
          is finalised and out!
          {' '}
          <Link to="/workerview">Click here to view it</Link>
          .
        </div>
      </div>
    </div>
  );
}

export default function WorkerIndexPage({ user }) {
  const [isWorker, setIsWorker] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(0);
  const [realName, setRealName] = useState('');
  const [shiftsLeft, setShiftsLeft] = useState(0);
  const [leavesLeft, setLeavesLeft] = useState(0);
  const [events, setEvents] = useState([]);
  const [hasOptimisedSchedule, setHasOptimisedSchedule] = useState(false);

  const getMonthNumber = (date, type) => {
    const currentMonth = date.getMonth();
    const nextMonth = (currentMonth === 11) ? 0 : date.getMonth() + 1;
    const monthNumber = (type === 'next') ? nextMonth : currentMonth;
    return monthNumber;
  };
  const getMonthDate = (date, type) => {
    const currentMonth = date.getMonth();
    const nextMonth = (currentMonth === 11) ? 0 : date.getMonth() + 1;
    const month = (type === 'next') ? nextMonth : currentMonth;
    const year = (type === 'next' && nextMonth === 0) ? date.getFullYear() + 1 : date.getFullYear();
    const monthDate = new Date(year, month, 1);
    return monthDate;
  };
  const getMonthString = (date) => {
    const formatter = new Intl.DateTimeFormat('default', { month: 'long' });
    const monthDateStr = formatter.format(date);
    return monthDateStr;
  };
  const getYearNumber = (date, type) => {
    const currentMonth = date.getMonth();
    const nextMonth = (currentMonth === 11) ? 0 : date.getMonth() + 1;
    const yearNumber = (type === 'next' && nextMonth === 0) ? date.getFullYear() + 1 : date.getFullYear();
    return yearNumber;
  };
  const getYearString = (date) => {
    const formatter = new Intl.DateTimeFormat('default', { year: 'numeric' });
    const yearStr = formatter.format(date);
    return yearStr;
  };
  const [nextMonthDate] = useState(getMonthDate(new Date('2021-11-30'), 'next'));

  useEffect(() => {
    const hasUserId = !!user && user.user_id;
    const data = {
      month: getMonthNumber(new Date(), 'next'),
      year: getYearNumber(new Date(), 'next'),
    };
    if (hasUserId) {
      axios
        .get(`${REACT_APP_BACKEND_URL}/api/worker/${user.user_id}/year/${data.year}/month/${data.month}/schedule`, data, getApiHeader(user.token))
        .then((response) => {
          console.log('worker index:');
          console.log(response.data);
          if (response.data.role === 'worker') {
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
            setLeavesLeft(response.data.remainingLeaves);
            setShiftsLeft(response.data.remainingShifts);
            setRealName(response.data.realName);
            setUserId(response.data.userId);
            setEvents([...rerenderedEvents]);
            setIsWorker(true);
            setIsLoading(false);
            if (response.data.scheduleSelected) {
              setHasOptimisedSchedule(true);
            }
          } else {
            setIsWorker(false);
            setIsLoading(false);
          }
        })
        .catch(() => {
          // handle error
          setIsWorker(false);
          setIsLoading(false);
        });
    } else {
      setIsWorker(false);
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

  if (!isWorker && !isLoading) {
    return (
      <Error404 />
    );
  }

  return (
    <div className="container pt-5 pb-5">
      <div className="row w-100 pt-3">
        <WorkerIndexAlert
          hasOptimisedSchedule={hasOptimisedSchedule}
          getMonthString={getMonthString}
          getYearString={getYearString}
          nextMonthDate={nextMonthDate}
        />
        <div className="col-12 pt-1 d-flex justify-content-center align-items-center">
          <div className="me-4">
            <span className="square-image-wrapper">
              <span className="square-image">
                <img alt={`${realName}`} src={`https://avatars.dicebear.com/api/croodles-neutral/${userId}.svg`} />
              </span>
            </span>
          </div>
          <div>
            <h3>{realName}</h3>
            <h5 className="mb-0 fade-text-color">
              <strong>Worker</strong>
            </h5>
          </div>
        </div>
        <div className="col-12"><hr /></div>
        <div className="col-12 pt-3">
          <div className="row">
            <div className="col-8 pt-3 s-3 pe-3">
              <div className="row">
                <div className="col-9">
                  <h4>
                    Shift Submission →
                    {' '}
                    {getMonthString(nextMonthDate)}
                    {' '}
                    {getYearString(nextMonthDate)}
                  </h4>
                </div>
                <div className="col-3 d-flex justify-content-end align-items-center">
                  <Link className="link-button" to="/workeredit" role="button">Edit</Link>
                </div>
              </div>
              <div className="col-12 pt-2">
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
            </div>
            <div className="col-4 pt-3 ps-3 pe-3">
              <div />
              <h4>
                Shift Summary →
                {' '}
                {getYearString(nextMonthDate)}
              </h4>
              <div className="col-12 pt-2">
                <pre>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th scope="col">{' '}</th>
                          <th scope="col" className="text-center">Days</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong>Number of Leaves Left</strong>
                          </td>
                          <td className="text-center">{leavesLeft}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Number of Shifts to be Allocated</strong>
                          </td>
                          <td className="text-center">{shiftsLeft}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </pre>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
