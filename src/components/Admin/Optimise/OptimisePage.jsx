/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import {
  Link,
  Redirect,
} from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import axios from 'axios';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../../modules/urls.mjs';
import getApiHeader from '../../../modules/api-headers.mjs';
// Custom Components
import Error404 from '../../Error/Error404Page.jsx';

function AdminOptimiseSelectInterface({
  nextMonthDate,
  schedules,
  selectedOption,
  handleRadioChange,
  handleConfirmClick,
}) {
  return (
    <>
      <div className="col-12">
        <div className="row">
          <div className="col-7">
            <h4>Select an Optimised Schedule</h4>
          </div>
          <div className="col-5 d-flex justify-content-end align-items-center">
            <button type="button" onClick={handleConfirmClick}>Confirm Schedule</button>
          </div>
        </div>
      </div>
      <div className="col-12"><hr /></div>
      <div className="col-12 pt-1">
        {schedules.map((schedule, index) => (
          <div className="form-check pb-3" key={schedule.id}>
            <div className="row">
              <div className="col-1 d-flex justify-content-center">
                <input
                  type="radio"
                  name="exampleRadios"
                  id={`exampleRadios${index}`}
                  value={schedule.id}
                  checked={(selectedOption === schedule.id)}
                  onChange={handleRadioChange}
                />
              </div>
              <div className="col-11">
                <div className="row">
                  <div className="col-9">
                    <label className="form-check-label w-100" htmlFor={`exampleRadios${index}`}>
                      <p>
                        Choice #
                        {index + 1}
                      </p>
                    </label>
                  </div>
                  <div className="col-3 d-flex justify-content-end">
                    <div>
                      <span className="badge bg-dark me-2">Leaves</span>
                    </div>
                  </div>
                </div>

                <pre>
                  <FullCalendar
                    plugins={[interactionPlugin, dayGridPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={false}
                    initialDate={nextMonthDate}
                    events={schedule.optimisations}
                    selectable
                  />
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="col-12 pt-3 d-flex justify-content-end">
        <button type="button" onClick={handleConfirmClick}>Confirm Schedule</button>
      </div>
      <div className="col-12 d-md-none pt-3"><hr /></div>
    </>
  );
}

function AdminOptimiseEditInterface({
  nextMonthDate,
  optimisedSchedule,
}) {
  return (
    <>
      <div className="col-12">
        <div className="row">
          <div className="col-7">
            <h4>Edit Optimised Schedule</h4>
          </div>
          <div className="col-5 d-flex justify-content-end align-items-center">
            <Link className="link-button" to="/adminedit" role="button">Edit</Link>
          </div>
        </div>
      </div>
      <div className="col-12"><hr /></div>
      <div className="col-12 pt-1">
        <div>
          <span className="badge bg-dark me-2">Leaves</span>
        </div>
      </div>
      <div className="col-12 pt-3">
        <pre>
          <FullCalendar
            plugins={[interactionPlugin, dayGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            initialDate={nextMonthDate}
            selectable
            events={optimisedSchedule}
          />
        </pre>
      </div>
      <div className="col-12 pt-3 d-flex justify-content-end">
        <Link className="link-button" to="/adminedit" role="button">Edit</Link>
      </div>
      <div className="col-12 d-md-none pt-3"><hr /></div>
    </>
  );
}

function AdminOptimiseMainInterface({
  hasOptimisedSchedule,
  nextMonthDate,
  schedules,
  selectedOption,
  optimisedSchedule,
  handleRadioChange,
  handleConfirmClick,
}) {
  if (!hasOptimisedSchedule) {
    return (
      <AdminOptimiseSelectInterface
        nextMonthDate={nextMonthDate}
        schedules={schedules}
        selectedOption={selectedOption}
        handleRadioChange={handleRadioChange}
        handleConfirmClick={handleConfirmClick}
      />
    );
  }
  return (
    <AdminOptimiseEditInterface
      nextMonthDate={nextMonthDate}
      optimisedSchedule={optimisedSchedule}
    />
  );
}

function AdminOptimiseShiftSummary({ workers }) {
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

export default function AdminOptimisePage({ user }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const [, setUserId] = useState(0);
  const [, setRealName] = useState('');
  const [workers, setWorkers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [hasOptimisedSchedule, setHasOptimisedSchedule] = useState(false);
  const [optimisedSchedule, setOptimisedSchedule] = useState([]);

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
      month: getMonthNumber(new Date('2021-11-30'), 'next'),
      year: getYearNumber(new Date('2021-11-30'), 'next'),
    };
    if (hasUserId) {
      axios
        .get(`${REACT_APP_BACKEND_URL}/api/admin/${user.user_id}/year/${data.year}/month/${data.month}/optimisations`, data, getApiHeader(user.token))
        .then((response) => {
          if (response.data.role === 'admin') {
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
            setSelectedOption(response.data.schedules[0].id);
            setRealName(response.data.realName);
            setUserId(response.data.userId);
            setWorkers([...response.data.workers]);
            setSchedules([...newSchedules]);
            setIsAdmin(true);
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
              setOptimisedSchedule([...optimisedSchedulePut]);
            }
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

  const handleRadioChange = (event) => {
    setSelectedOption(Number(event.target.value));
  };

  const handleConfirmClick = (event) => {
    event.preventDefault();
    const data = {
      month: getMonthNumber(new Date('2021-11-30'), 'next'),
      year: getYearNumber(new Date('2021-11-30'), 'next'),
    };
    axios
      .put(
        `${REACT_APP_BACKEND_URL}/api/admin/${user.user_id}/schedule/${selectedOption}/select`,
        data,
        getApiHeader(user.token),
      )
      .then((response) => {
        if (response.data.role === 'admin') {
          let newSchedules = [...response.data.schedules];
          newSchedules = newSchedules.map((newSchedule) => {
            const newOptimisations = [
              ...newSchedule.optimisations,
            ];
            const rerenderedOptimisations = newOptimisations.map((newOptimisation) => {
              if (newOptimisation.extendedProps.type === 'shift') {
                return {
                  ...newOptimisation,
                  classNames: [`shift-block-${Number(newOptimisation.extendedProps.userId) % 50}`],
                };
              }

              return {
                ...newOptimisation,
                classNames: ['leave-block'],
              };
            });

            return {
              ...newSchedule,
              optimisations: rerenderedOptimisations,
            };
          });
          setSelectedOption(response.data.schedules[0].id);
          setRealName(response.data.realName);
          setUserId(response.data.userId);
          setWorkers([...response.data.workers]);
          setSchedules([...newSchedules]);
          setIsAdmin(true);
          setIsLoading(false);
          if (response.data.scheduleSelected) {
            let optimisedScheduleGet = [...response.data.optimisedSchedule];
            optimisedScheduleGet = optimisedScheduleGet.map((optimisedEvent) => {
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
            setOptimisedSchedule([...optimisedScheduleGet]);
          }
        } else {
          setIsAdmin(false);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };

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

  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container-fluid pt-5">
      <div className="row w-100 pt-3 pb-3">
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
        <div className="col-12 col-md-8 pt-3 optimise-main-interface">
          <AdminOptimiseMainInterface
            hasOptimisedSchedule={hasOptimisedSchedule}
            nextMonthDate={nextMonthDate}
            schedules={schedules}
            selectedOption={selectedOption}
            optimisedSchedule={optimisedSchedule}
            handleRadioChange={handleRadioChange}
            handleConfirmClick={handleConfirmClick}
          />
        </div>
        <div className="col-12 col-md-4">
          <AdminOptimiseShiftSummary workers={workers} />
        </div>
      </div>
    </div>
  );
}
