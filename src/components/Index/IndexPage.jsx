/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import {
  Link,
} from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!

export default function IndexPage() {
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
    <div className="container-fluid pt-5">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1">
          <div className="row align-items-center">
            <div className="col-6">
              <h3>
                Shift Overview →
                {' '}
                {getNextMonthString(nextMonthDate)}
              </h3>
            </div>
            <div className="col-6  d-flex justify-content-end">
              <Link className="btn btn-primary" to="/adminedit" role="button">Edit</Link>
            </div>
          </div>
        </div>
        <div className="col-12"><hr /></div>
        <div className="col-12 pt-1">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            initialDate={nextMonthDate}
            headerToolbar={false}
          />
        </div>
        <div className="col-12 pt-3" />
      </div>
    </div>
  );
}
