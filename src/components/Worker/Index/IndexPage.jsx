/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!

export default function WorkerIndexPage() {
  const [events, setEvents] = useState([
    { title: '', date: '2021-12-03', extendedProps: { user_id: 1, real_name: 'Lee Chuan Xin', type: 'shift' } },
    { title: '', date: '2021-12-07', extendedProps: { user_id: 1, real_name: 'Lee Chuan Xin', type: 'leave' } },
  ]);

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
  const [currentMonthDate] = useState(getMonthDate(new Date(), 'current'));
  const [nextMonthDate] = useState(getMonthDate(new Date(), 'next'));

  useEffect(() => {
    const newEvents = [...events];
    const rerenderedEvents = newEvents.map((event) => {
      if (event.extendedProps.type === 'shift') {
        return {
          ...event,
          title: `${event.extendedProps.type.substring(0, 1).toUpperCase()}${event.extendedProps.type.substring(1)}`,
          classNames: [`shift-block-${Number(event.extendedProps.user_id) % 50}`],
        };
      }

      return {
        ...event,
        title: `${event.extendedProps.type.substring(0, 1).toUpperCase()}${event.extendedProps.type.substring(1)}`,
        classNames: ['leave-block'],
      };
    });
    setEvents(rerenderedEvents);
  }, []);

  return (
    <div className="container pt-5 pb-5">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1">
          <div className="alert alert-warning d-flex align-items-center" role="alert">
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
              Schedule for
              {' '}
              {getMonthString(currentMonthDate)}
              {' '}
              is out! Click here
            </div>
          </div>
        </div>
        <div className="col-12"><hr /></div>
        <div className="col-12 pt-3">
          <div className="row">
            <div className="col-6 ps-3 pe-3">
              <div />
              <h4>Shift Summary</h4>
              <div className="col-12 pt-2">
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th scope="col">{' '}</th>
                        <th scope="col" className="text-center">Units</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Number of Leaves Left</strong>
                        </td>
                        <td className="text-center">5</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Number of Shifts to be Allocated</strong>
                        </td>
                        <td className="text-center">2</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-6 ps-3 pe-3">
              <h4>Shift Submission</h4>
              <div className="col-12 pt-2">
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={events}
                  initialDate={nextMonthDate}
                  headerToolbar={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
