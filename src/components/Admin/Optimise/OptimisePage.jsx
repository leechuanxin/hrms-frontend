/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable

function AdminOptimiseSelectedUser({ user }) {
  if (user && user.user_id) {
    const items = Object.entries(user).filter((item) => (item[0] !== 'real_name' && item[0] !== 'user_id'));
    return (
      <div className="card w-100">
        <div className="card-header text-center">
          {user.real_name}
        </div>
        <div className="card-body text-center">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  {
                    items.map((key) => (
                      <th key={key[0]} scope="col">{key[0].toUpperCase()}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                <tr>
                  {
                    items.map((key) => (
                      <td key={key[0]} className={((key[1] && key[1].status) ? `table-${key[1].status}` : '')}>{key[1].value}</td>
                    ))
                  }
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function AdminOptimisePage() {
  const [users] = useState([
    {
      user_id: 1,
      real_name: 'Lee Chuan Xin',
      x: {
        value: 5,
      },
      y: {
        value: 123,
        status: 'success',
      },
      z: {
        value: 45,
        status: 'warning',
      },
      a: {
        value: 5,
      },
      b: {
        value: 3,
      },
    },
    {
      user_id: 2,
      real_name: 'Wong Shen Nan',
      x: {
        value: 2,
      },
      y: {
        value: 234,
        status: 'danger',
      },
      z: {
        value: 5,
      },
      a: {
        value: 6,
      },
      b: {
        value: 7,
      },
    },
  ]);
  const [selectedOption, setSelectedOption] = useState('option1');
  const [events, setEvents] = useState([
    {
      title: '',
      date: '2021-12-03',
      extendedProps: {
        id: 1, user_id: 1, real_name: 'Lee Chuan Xin', type: 'shift', date: '2021-12-03',
      },
    },
    {
      title: '',
      date: '2021-12-07',
      extendedProps: {
        id: 2, user_id: 1, real_name: 'Lee Chuan Xin', type: 'leave', date: '2021-12-07',
      },
    },
    {
      title: '',
      date: '2021-12-08',
      extendedProps: {
        id: 3, user_id: 2, real_name: 'Wong Shen Nan', type: 'shift', date: '2021-12-08',
      },
    },
  ]);
  const [selectedUser, setSelectedUser] = useState(null);

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
  const getYearString = (date) => {
    const formatter = new Intl.DateTimeFormat('default', { year: 'numeric' });
    const yearStr = formatter.format(date);
    return yearStr;
  };
  const [nextMonthDate] = useState(getMonthDate(new Date(), 'next'));

  useEffect(() => {
    const newEvents = [...events];
    const rerenderedEvents = newEvents.map((event) => {
      const title = `${event.extendedProps.real_name}'s ${event.extendedProps.type.substring(0, 1).toUpperCase()}${event.extendedProps.type.substring(1)}`;

      if (event.extendedProps.type === 'shift') {
        return {
          ...event,
          title,
          classNames: [`shift-block-${Number(event.extendedProps.user_id) % 50}`],
        };
      }

      return {
        ...event,
        title,
        classNames: ['leave-block'],
      };
    });
    setEvents(rerenderedEvents);
  }, []);

  const handleEventClick = ({ event }) => {
    const iterableUsers = [...users];
    let index = -1;
    for (let loopIndex = 0; loopIndex < iterableUsers.length; loopIndex += 1) {
      if (iterableUsers[loopIndex].user_id === event.extendedProps.user_id) {
        index = loopIndex;
        break;
      }
    }
    const selectedIterableUser = iterableUsers[index];
    setSelectedUser({ ...selectedIterableUser });
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="container-fluid pt-5">
      <div className="row w-100 pt-3 pb-3">
        <div className="col-12 pt-1">
          <h3>
            {getMonthString(nextMonthDate)}
            {' '}
            {getYearString(nextMonthDate)}
          </h3>
          <hr />
        </div>
        <div className="col-4 pt-1">
          <AdminOptimiseSelectedUser user={selectedUser} />
        </div>
        <div className="col-8 pt-1">
          <div className="col-12">
            <h4>Select an Optimised Schedule</h4>
          </div>
          <div className="col-12 pt-1">
            <div className="form-check pb-3">
              <div className="row">
                <div className="col-1 d-flex justify-content-center">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="exampleRadios"
                    id="exampleRadios1"
                    value="option1"
                    checked={(selectedOption === 'option1')}
                    onChange={handleRadioChange}
                  />
                </div>
                <div className="col-8">
                  <label className="form-check-label w-100" htmlFor="exampleRadios1">
                    <p>Choice #1</p>
                  </label>
                  <FullCalendar
                    plugins={[interactionPlugin, dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    headerToolbar={false}
                    initialDate={nextMonthDate}
                    eventClick={handleEventClick}
                    selectable
                  />
                </div>
                <div className="col-3">
                  <Link className="btn btn-primary w-100" to="/adminedit" role="button">Edit</Link>
                </div>
              </div>
            </div>
            <div className="form-check pb-3">
              <div className="row">
                <div className="col-1 d-flex justify-content-center">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="exampleRadios"
                    id="exampleRadios2"
                    value="option2"
                    checked={(selectedOption === 'option2')}
                    onChange={handleRadioChange}
                  />
                </div>
                <div className="col-8">
                  <label className="form-check-label w-100" htmlFor="exampleRadios2">
                    <p>Choice #2</p>
                  </label>
                  <FullCalendar
                    plugins={[interactionPlugin, dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    headerToolbar={false}
                    initialDate={nextMonthDate}
                    eventClick={handleEventClick}
                    selectable
                  />
                </div>
                <div className="col-3">
                  <Link className="btn btn-primary w-100" to="/adminedit" role="button">Edit</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
