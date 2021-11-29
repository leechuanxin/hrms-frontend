/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import axios from 'axios';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../../modules/urls.mjs';
import getApiHeader from '../../../modules/api-headers.mjs';
import WorkerAddEventModal from './Modals/WorkerAddEventModal.jsx';
import WorkerEditDeleteEventModal from './Modals/WorkerEditDeleteEventModal.jsx';
import WorkerEditEventModal from './Modals/WorkerEditEventModal.jsx';
import Error404 from '../../Error/Error404Page.jsx';

export default function WorkerEditPage({ user }) {
  const [eventTypes] = useState(['shift', 'leave']);
  const [events, setEvents] = useState([]);
  const [isWorker, setIsWorker] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditDeleteModal, setShowEditDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

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
            setEvents([...rerenderedEvents]);
            setIsWorker(true);
            setIsLoading(false);
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
      id: info.extendedProps.id,
      title: info.title,
      date: info.extendedProps.date,
      extendedProps: {
        ...info.extendedProps,
      },
    };
    setSelectedEvent(eventObj);
    setShowEditDeleteModal(true);
  };

  const handleModalAddSubmit = () => {
    // get all events on selected day
    let newEvent = {};
    if (selectedEventType.trim() !== '') {
      const data = {
        userId: user.user_id,
        organisationId: user.organisation_id,
        type: selectedEventType,
        dateAt: new Date(selectedDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      axios
        .post(`${REACT_APP_BACKEND_URL}/api/worker/${user.user_id}/event`, data, getApiHeader(user.token))
        .then((response) => {
          if (response.data.newEvent) {
            const { dateAt } = response.data.newEvent;
            const dateAtObj = new Date(dateAt);

            const yearNumberStr = `${dateAtObj.getFullYear()}`;
            let monthNumberStr = `${dateAtObj.getMonth() + 1}`;
            let dateNumberStr = `${dateAtObj.getDate()}`;

            if (monthNumberStr < 2) {
              monthNumberStr = `0${monthNumberStr}`;
            }

            if (dateNumberStr.length < 2) {
              dateNumberStr = `0${dateNumberStr}`;
            }

            newEvent = {
              ...response.data.newEvent,
              classNames: (response.data.newEvent.type === 'shift')
                ? [`shift-block-${response.data.newEvent.userId % 50}`]
                : ['leave-block'],
              date: `${yearNumberStr}-${monthNumberStr}-${dateNumberStr}`,
              extendedProps: {
                id: response.data.newEvent.id,
                userId: response.data.newEvent.userId,
                realName: response.data.newEvent.realName,
                type: response.data.newEvent.type,
                title: response.data.newEvent.title,
                date: `${yearNumberStr}-${monthNumberStr}-${dateNumberStr}`,
              },
            };
            setEvents((oldEvents) => ([...oldEvents, newEvent]));
          }
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
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
    const data = {
      organisationId: user.organisation_id,
      type: event.extendedProps.type,
      dateAt: new Date(event.startStr),
    };
    let modifiedEvent = {};
    axios
      .put(
        `${REACT_APP_BACKEND_URL}/api/worker/${user.user_id}/event/${event.extendedProps.id}`,
        data,
        getApiHeader(user.token),
      )
      .then((response) => {
        if (!response.data.isError) {
          if (response.data.modifiedEvent) {
            const { dateAt } = response.data.modifiedEvent;
            const dateAtObj = new Date(dateAt);

            const yearNumberStr = `${dateAtObj.getFullYear()}`;
            let monthNumberStr = `${dateAtObj.getMonth() + 1}`;
            let dateNumberStr = `${dateAtObj.getDate()}`;

            if (monthNumberStr < 2) {
              monthNumberStr = `0${monthNumberStr}`;
            }

            if (dateNumberStr.length < 2) {
              dateNumberStr = `0${dateNumberStr}`;
            }

            modifiedEvent = {
              ...response.data.modifiedEvent,
              classNames: (response.data.modifiedEvent.type === 'shift')
                ? [`shift-block-${response.data.modifiedEvent.userId % 50}`]
                : ['leave-block'],
              date: `${yearNumberStr}-${monthNumberStr}-${dateNumberStr}`,
              extendedProps: {
                id: response.data.modifiedEvent.id,
                userId: response.data.modifiedEvent.userId,
                realName: response.data.modifiedEvent.realName,
                type: response.data.modifiedEvent.type,
                title: response.data.modifiedEvent.title,
                date: `${yearNumberStr}-${monthNumberStr}-${dateNumberStr}`,
              },
            };

            setEvents((oldEvents) => [
              ...oldEvents.filter(
                (oldEvent) => oldEvent.extendedProps.id !== modifiedEvent.id,
              ),
              { ...modifiedEvent },
            ]);
          }
        } else {
          console.log(response.data.error);
        }
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };

  const handleEventClick = (info) => handleShowEditDeleteModal(info.event);

  const handleEventDrop = (info) => handleMoveEvent(info.event);

  const handleDeleteEvent = () => {
    axios
      .delete(
        `${REACT_APP_BACKEND_URL}/api/worker/${user.user_id}/event/${selectedEvent.extendedProps.id}`,
        getApiHeader(user.token),
      )
      .then((response) => {
        if (!response.data.isError) {
          setEvents((newEvents) => [...newEvents].filter(
            (currentEvent) => (currentEvent.extendedProps.id !== Number(response.data.eventId)),
          ));
        }
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });

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
    let modifiedEvent = {};
    if (selectedEventType.trim() !== '') {
      const data = {
        organisationId: user.organisation_id,
        type: selectedEventType,
        dateAt: new Date(selectedEvent.extendedProps.date),
      };
      axios
        .put(
          `${REACT_APP_BACKEND_URL}/api/worker/${user.user_id}/event/${selectedEvent.extendedProps.id}`,
          data,
          getApiHeader(user.token),
        )
        .then((response) => {
          if (!response.data.isError) {
            if (response.data.modifiedEvent) {
              const { dateAt } = response.data.modifiedEvent;
              const dateAtObj = new Date(dateAt);

              const yearNumberStr = `${dateAtObj.getFullYear()}`;
              let monthNumberStr = `${dateAtObj.getMonth() + 1}`;
              let dateNumberStr = `${dateAtObj.getDate()}`;

              if (monthNumberStr < 2) {
                monthNumberStr = `0${monthNumberStr}`;
              }

              if (dateNumberStr.length < 2) {
                dateNumberStr = `0${dateNumberStr}`;
              }

              modifiedEvent = {
                ...response.data.modifiedEvent,
                classNames: (response.data.modifiedEvent.type === 'shift')
                  ? [`shift-block-${response.data.modifiedEvent.userId % 50}`]
                  : ['leave-block'],
                date: `${yearNumberStr}-${monthNumberStr}-${dateNumberStr}`,
                extendedProps: {
                  id: response.data.modifiedEvent.id,
                  userId: response.data.modifiedEvent.userId,
                  realName: response.data.modifiedEvent.realName,
                  type: response.data.modifiedEvent.type,
                  title: response.data.modifiedEvent.title,
                  date: `${yearNumberStr}-${monthNumberStr}-${dateNumberStr}`,
                },
              };

              setEvents((oldEvents) => [
                ...oldEvents.filter(
                  (oldEvent) => oldEvent.extendedProps.id !== modifiedEvent.id,
                ),
                { ...modifiedEvent },
              ]);
            }
          } else {
            console.log(response.data.error);
          }
        })
        .catch((error) => {
        // handle error
          console.log(error);
        });
    }

    handleCloseEditModal();
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
          <div className="col-12 pt-1 d-flex justify-content-center">
            <div className="spinner-border mt-5" style={{ width: '5rem', height: '5rem' }} role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  if (!isWorker && !isLoading) {
    return (
      <Error404 />
    );
  }

  return (
    <div className="container pt-5 pb-3">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1">
          <h4 className="text-center">
            Shift Submission →
            {' '}
            {getMonthString(nextMonthDate)}
            {' '}
            {getYearString(nextMonthDate)}
          </h4>
          <p className="text-center">
            <small className="fade-text-color">Your changes will be automatically saved.</small>
          </p>
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
