/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import {
  Link,
} from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!

export default function AdminIndexPage() {
  const newUserId = 51;
  const [events, setEvents] = useState([
    { title: '', date: '2021-12-03', extendedProps: { user_id: newUserId, real_name: 'Lee Chuan Xin', type: 'shift' } },
    { title: '', date: '2021-12-07', extendedProps: { user_id: newUserId, real_name: 'Lee Chuan Xin', type: 'leave' } },
  ]);

  const getNextMonthString = (date) => {
    const formatter = new Intl.DateTimeFormat('default', { month: 'long' });
    const nextMonthDateStr = formatter.format(date);
    return nextMonthDateStr;
  };

  const getNextMonthDate = (date) => {
    const nextMonthNumber = date.getMonth() + 1;
    const nextMonthDate = new Date(date.getFullYear(), nextMonthNumber, 1);
    return nextMonthDate;
  };
  const [nextMonthDate] = useState(getNextMonthDate(new Date()));

  useEffect(() => {
    const newEvents = [...events];
    const rerenderedEvents = newEvents.map((event) => {
      if (event.extendedProps.type === 'shift') {
        return {
          ...event,
          title: `${event.extendedProps.real_name}'s ${event.extendedProps.type.substring(0, 1).toUpperCase()}${event.extendedProps.type.substring(1)}`,
          classNames: [`shift-block-${Number(event.extendedProps.user_id) % 50}`],
        };
      }

      return {
        ...event,
        title: `${event.extendedProps.real_name}'s ${event.extendedProps.type.substring(0, 1).toUpperCase()}${event.extendedProps.type.substring(1)}`,
        classNames: ['leave-block'],
      };
    });
    setEvents(rerenderedEvents);
  }, []);

  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1">
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="mb-0">
                Shift Overview →
                {' '}
                {getNextMonthString(nextMonthDate)}
              </h4>
            </div>
            <div className="col-6  d-flex justify-content-end">
              <Link className="btn btn-primary" to="/adminedit" role="button">Edit</Link>
            </div>
          </div>
        </div>
        <div className="col-12"><hr /></div>
        <div className="col-12 pt-3">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            initialDate={nextMonthDate}
            headerToolbar={false}
          />
        </div>
        <div className="col-12 pt-3"><hr /></div>
        <div className="col-12 pt-3">
          <div className="row align-items-center">
            <div className="col-12">
              <h4 className="mb-0">
                Shift Summary
              </h4>
            </div>
          </div>
        </div>
        <div className="col-12 pt-3"><hr /></div>
        <div className="col-12 pt-3">
          <span className="badge rounded-pill bg-success me-2">Healthy</span>
          <span className="badge rounded-pill bg-warning text-dark me-2">Running Low</span>
          <span className="badge rounded-pill bg-danger me-2">Danger</span>
        </div>
        <div className="col-12 pt-3">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col">{' '}</th>
                  <th scope="col">X</th>
                  <th scope="col">Y</th>
                  <th scope="col">Z</th>
                  <th scope="col">A</th>
                  <th scope="col">B</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lee Chuan Xin</td>
                  <td>5</td>
                  <td className="table-success">123</td>
                  <td className="table-warning">45</td>
                  <td>5</td>
                  <td>3</td>
                </tr>
                <tr>
                  <td>Wong Shen Nan</td>
                  <td>2</td>
                  <td className="table-danger">234</td>
                  <td>5</td>
                  <td>6</td>
                  <td>7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
