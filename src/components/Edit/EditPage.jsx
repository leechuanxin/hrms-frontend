/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable

export default function EditPage() {
  const newUserId = 51;
  const [events, setEvents] = useState([
    { title: '', date: '2021-11-03', extendedProps: { user_id: newUserId, real_name: 'Chuan Xin', type: 'shift' } },
    { title: '', date: '2021-11-07', extendedProps: { user_id: newUserId, real_name: 'Chuan Xin', type: 'leave' } },
  ]);

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
          <FullCalendar
            plugins={[interactionPlugin, dayGridPlugin]}
            initialView="dayGridMonth"
            editable
            events={events}
          />
        </div>
        <div className="col-12 pt-3" />
      </div>
    </div>
  );
}