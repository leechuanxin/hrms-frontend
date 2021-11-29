/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import {
  Redirect,
} from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import axios from 'axios';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../../modules/urls.mjs';
import getApiHeader from '../../../modules/api-headers.mjs';
// CUSTOM IMPORTS
import Error404 from '../../Error/Error404Page.jsx';

export default function EditPage({ user }) {
  const getMonthDate = (date, type) => {
    const currentMonth = date.getMonth();
    const nextMonth = (currentMonth === 11) ? 0 : date.getMonth() + 1;
    const month = (type === 'next') ? nextMonth : currentMonth;
    const year = (type === 'next' && nextMonth === 0) ? date.getFullYear() + 1 : date.getFullYear();
    const monthDate = new Date(year, month, 1);
    return monthDate;
  };
  const getMonthNumber = (date, type) => {
    const currentMonth = date.getMonth();
    const nextMonth = (currentMonth === 11) ? 0 : date.getMonth() + 1;
    const monthNumber = (type === 'next') ? nextMonth : currentMonth;
    return monthNumber;
  };
  const getYearNumber = (date, type) => {
    const currentMonth = date.getMonth();
    const nextMonth = (currentMonth === 11) ? 0 : date.getMonth() + 1;
    const yearNumber = (type === 'next' && nextMonth === 0) ? date.getFullYear() + 1 : date.getFullYear();
    return yearNumber;
  };
  const getMonthString = (date) => {
    const formatter = new Intl.DateTimeFormat('default', { month: 'long' });
    const monthDateStr = formatter.format(date);
    return monthDateStr;
  };
  const getYearString = (date) => {
    const formatter = new Intl.DateTimeFormat('default', { year: 'numeric' });
    const yearStr = formatter.format(date);
    return yearStr;
  };
  const [nextMonthDate] = useState(getMonthDate(new Date('2021-11-30'), 'next'));
  const [events, setEvents] = useState([]);
  const [, setScheduleId] = useState(0);

  const [, setUserId] = useState(0);
  const [, setRealName] = useState('');
  const [isWorker, setIsWorker] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [, setWorkers] = useState([]);
  const [, setSchedules] = useState([]);
  const [, setHasOptimisedSchedule] = useState(false);

  useEffect(() => {
    const hasUserId = !!user && user.user_id;
    const data = {
      month: getMonthNumber(new Date(), 'next'),
      year: getYearNumber(new Date(), 'next'),
    };
    if (hasUserId) {
      axios
        .get(`${REACT_APP_BACKEND_URL}/api/worker/${user.user_id}/year/${data.year}/month/${data.month}/optimisations`, data, getApiHeader(user.token))
        .then((response) => {
          if (response.data.role === 'worker') {
            let newSchedules = [...response.data.schedules];
            newSchedules = newSchedules.map((newSchedule) => {
              const newOptimisations = [
                ...newSchedule.optimisations,
              ];
              const rerenderedOptimisations = newOptimisations.map((event) => {
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

              return {
                ...newSchedule,
                optimisations: rerenderedOptimisations,
              };
            });

            setRealName(response.data.realName);
            setUserId(response.data.userId);
            setWorkers([...response.data.workers]);
            setSchedules([...newSchedules]);
            setIsWorker(true);
            setIsLoading(false);
            if (response.data.scheduleSelected) {
              let optimisedSchedulePut = [...response.data.optimisedSchedule];
              optimisedSchedulePut = optimisedSchedulePut.map((optimisedEvent) => {
                if (optimisedEvent.extendedProps.type === 'shift') {
                  return {
                    ...optimisedEvent,
                    classNames: [`shift-block-${Number(optimisedEvent.extendedProps.userId) % 50}`],
                  };
                }

                return {
                  ...optimisedEvent,
                  classNames: ['leave-block'],
                };
              });
              setHasOptimisedSchedule(true);
              setEvents([...optimisedSchedulePut]);
            }
            if (response.data.schedules && response.data.schedules.length > 0) {
              let currScheduleId = 0;
              for (let i = 0; i < response.data.schedules.length; i += 1) {
                if (response.data.schedules[i].isSelected) {
                  currScheduleId = response.data.schedules[i].id;
                }
              }
              setScheduleId(currScheduleId);
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

  if (isLoading) {
    return (
      <div className="container pt-5 pb-5">
        <div className="row w-100 pt-3">
          <div className="col-12 pt-1 d-flex justify-content-center">
            <div className="spinner-border mt-5" style={{ width: '5rem', height: '5rem' }} role="status">
              <span className="sr-only">Loading...</span>
            </div>
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

  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container-fluid pt-5">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1">
          <p className="mb-0">
            <a href="/"><small>« Back to Home</small></a>
          </p>
          <hr />
        </div>
        <div className="col-12 pt-3">
          <h3>
            {getMonthString(nextMonthDate)}
            {' '}
            {getYearString(nextMonthDate)}
          </h3>
          <hr />
        </div>
        <div className="col-12 pt-3">
          <FullCalendar
            plugins={[interactionPlugin, dayGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            initialDate={nextMonthDate}
            events={events}
          />
        </div>
        <div className="col-12 pt-3" />
      </div>
    </div>
  );
}
