/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
// CUSTOM IMPORTS
import WorkerAddEventModal from './Modals/WorkerAddEventModal.jsx';
import WorkerEditDeleteEventModal from './Modals/WorkerEditDeleteEventModal.jsx';
import WorkerEditEventModal from './Modals/WorkerEditEventModal.jsx';

export default function WorkerEditPage() {
  const [user] = useState(
    {
      user_id: 1,
      real_name: 'Lee Chuan Xin',
    },
  );
  const [eventTypes] = useState(['shift', 'leave']);
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
  ]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditDeleteModal, setShowEditDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
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
      const title = `${event.extendedProps.type.substring(0, 1).toUpperCase()}${event.extendedProps.type.substring(1)}`;

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

  const handleCloseAddModal = () => {
    setSelectedDate('');
    setSelectedEventType('');
    setShowAddModal(false);
  };
  const handleShowAddModal = (arg) => {
    setSelectedDate(arg.dateStr);
    setShowAddModal(true);
  };

  const handleClearSelectedEvent = () => {
    setSelectedEvent(null);
  };

  const handleCloseEditDeleteModal = () => {
    setShowEditDeleteModal(false);
  };

  const handleClearEventAndCloseEditDeleteModal = () => {
    handleClearSelectedEvent();
    handleCloseEditDeleteModal();
  };

  const handleShowEditDeleteModal = (info) => {
    const eventObj = {
      title: info.title,
      extendedProps: {
        ...info.extendedProps,
      },
    };
    setSelectedEvent(eventObj);
    setShowEditDeleteModal(true);
  };

  const handleModalAddSubmit = () => {
    const currentEvents = [...events];
    // get all events on selected day
    if (selectedEventType.trim() !== '') {
      const newEvent = {
        title: `${selectedEventType.substring(0, 1).toUpperCase()}${selectedEventType.substring(1)}`,
        date: selectedDate,
        classNames: (selectedEventType === 'shift')
          ? [`shift-block-${Number(user.user_id) % 50}`]
          : ['leave-block'],
        extendedProps: {
          id: currentEvents.length + 1,
          user_id: user.user_id,
          real_name: user.real_name,
          type: selectedEventType,
          date: selectedDate,
        },
      };
      setEvents((oldEvents) => ([...oldEvents, newEvent]));
    }

    handleCloseAddModal();
  };

  const handleSelectEventType = (e) => {
    const selected = eventTypes.filter((eventType) => eventType === e.target.value)[0];
    setSelectedEventType(selected);
  };

  const handleMoveEvent = (event) => {
    // set new date
    // copy over other props
    const eventObj = {
      title: event.title,
      extendedProps: {
        ...event.extendedProps,
        date: event.startStr,
      },
      date: event.startStr,
      classNames: [...event.classNames],
    };

    const newEvents = [...events].filter(
      (filteredEvent) => (filteredEvent.extendedProps.id !== eventObj.extendedProps.id),
    );
    newEvents.push(eventObj);
    setEvents([...newEvents]);
  };

  const handleEventClick = (info) => handleShowEditDeleteModal(info.event);

  const handleEventDrop = (info) => handleMoveEvent(info.event);

  const handleDeleteEvent = () => {
    setEvents((newEvents) => [...newEvents].filter(
      (currentEvent) => (currentEvent.extendedProps.id !== selectedEvent.extendedProps.id),
    ));
    handleClearSelectedEvent();
    handleCloseEditDeleteModal();
  };

  const handleShowEditModal = () => {
    handleCloseEditDeleteModal();
    setSelectedEventType(
      (selectedEvent && selectedEvent.extendedProps)
        ? selectedEvent.extendedProps.type
        : eventTypes[0],
    );
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    handleClearSelectedEvent();
    setSelectedDate('');
    setSelectedEventType('');
    setShowEditModal(false);
  };

  const handleEditSubmit = () => {
    if (selectedEventType.trim() !== '') {
      const modifiedEvent = {
        title: `${selectedEventType.substring(0, 1).toUpperCase()}`
          + `${selectedEventType.substring(1)}`,
        date: selectedEvent.extendedProps.date,
        classNames: (selectedEventType === 'shift')
          ? [`shift-block-${Number(user.user_id) % 50}`]
          : ['leave-block'],
        extendedProps: {
          id: selectedEvent.extendedProps.id,
          user_id: user.user_id,
          real_name: user.real_name,
          type: selectedEventType,
          date: selectedEvent.extendedProps.date,
        },
      };
      setEvents((oldEvents) => [
        ...oldEvents.filter(
          (oldEvent) => oldEvent.extendedProps.id !== selectedEvent.extendedProps.id,
        ),
        { ...modifiedEvent },
      ]);
    }

    handleCloseEditModal();
  };

  return (
    <div className="container-fluid pt-5">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1">
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
            editable
            selectable
            dateClick={handleShowAddModal}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            initialDate={nextMonthDate}
            events={events}
            headerToolbar={false}
          />
        </div>
        {/* Add Modal */}
        <WorkerAddEventModal
          eventTypes={eventTypes}
          showModal={showAddModal}
          onHideModal={handleCloseAddModal}
          handleSelectEventType={handleSelectEventType}
          handleSubmit={handleModalAddSubmit}
        />
        {/* Edit / Delete Modal */}
        <WorkerEditDeleteEventModal
          showModal={showEditDeleteModal}
          onHideModal={handleClearEventAndCloseEditDeleteModal}
          handleDeleteEvent={handleDeleteEvent}
          handleShowEditModal={handleShowEditModal}
        />
        {/* Edit Modal */}
        <WorkerEditEventModal
          eventTypes={eventTypes}
          selectedEvent={selectedEvent}
          showModal={showEditModal}
          onHideModal={handleCloseEditModal}
          handleSelectEventType={handleSelectEventType}
          handleSubmit={handleEditSubmit}
        />
        <div className="col-12 pt-3" />
      </div>
    </div>
  );
}
