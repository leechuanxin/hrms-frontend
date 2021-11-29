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
import AdminAddEventModal from './Modals/AdminAddEventModal.jsx';
import AdminEditDeleteEventModal from './Modals/AdminEditDeleteEventModal.jsx';
import AdminEditEventModal from './Modals/AdminEditEventModal.jsx';

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
  const [nextMonthDate] = useState(getMonthDate(new Date(), 'next'));
  const [eventTypes] = useState(['shift', 'leave']);
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditDeleteModal, setShowEditDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [, setUserId] = useState(0);
  const [, setRealName] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [workers, setWorkers] = useState([]);
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
              setEvents([...optimisedSchedulePut]);
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

  const handleCloseAddModal = () => {
    setCurrentDate('');
    setSelectedUser(null);
    setSelectedEventType('');
    setShowAddModal(false);
  };
  const handleShowAddModal = (arg) => {
    setCurrentDate(arg.dateStr);
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
    const userSelected = { ...selectedUser };
    const currentEvents = [...events];
    // get all events on selected day
    if (userSelected.user_id && selectedEventType.trim() !== '') {
      const newEvent = {
        title: `${userSelected.real_name}'s ${selectedEventType.substring(0, 1).toUpperCase()}${selectedEventType.substring(1)}`,
        date: currentDate,
        classNames: (selectedEventType === 'shift')
          ? [`shift-block-${Number(userSelected.user_id) % 50}`]
          : ['leave-block'],
        extendedProps: {
          id: currentEvents.length + 1,
          user_id: userSelected.user_id,
          real_name: userSelected.real_name,
          type: selectedEventType,
          date: currentDate,
        },
      };
      setEvents((oldEvents) => ([...oldEvents, newEvent]));
    }

    handleCloseAddModal();
  };

  const handleSelectUser = (e) => {
    const selected = workers.filter(
      (selectedU) => selectedU.user_id === Number(e.target.value),
    )[0];
    setSelectedUser(selected);
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
    setSelectedUser(
      (selectedEvent && selectedEvent.extendedProps)
        ? {
          user_id: selectedEvent.extendedProps.user_id,
          real_name: selectedEvent.extendedProps.real_name,
        }
        : {
          ...workers[0],
        },
    );
    setSelectedEventType(
      (selectedEvent && selectedEvent.extendedProps)
        ? selectedEvent.extendedProps.type
        : eventTypes[0],
    );
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    handleClearSelectedEvent();
    setCurrentDate('');
    setSelectedUser(null);
    setSelectedEventType('');
    setShowEditModal(false);
  };

  const handleEditSubmit = () => {
    const userSelected = { ...selectedUser };
    if (userSelected.user_id && selectedEventType.trim() !== '') {
      const modifiedEvent = {
        title: `${userSelected.real_name}'s ${selectedEventType.substring(0, 1).toUpperCase()}${selectedEventType.substring(1)}`,
        date: selectedEvent.extendedProps.date,
        classNames: (selectedEventType === 'shift')
          ? [`shift-block-${Number(userSelected.user_id) % 50}`]
          : ['leave-block'],
        extendedProps: {
          id: selectedEvent.extendedProps.id,
          user_id: userSelected.user_id,
          real_name: userSelected.real_name,
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
            headerToolbar={false}
            initialDate={nextMonthDate}
            dateClick={handleShowAddModal}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            events={events}
          />
        </div>
        {/* Add Modal */}
        <AdminAddEventModal
          users={workers}
          eventTypes={eventTypes}
          showModal={showAddModal}
          onHideModal={handleCloseAddModal}
          handleSelectUser={handleSelectUser}
          handleSelectEventType={handleSelectEventType}
          handleSubmit={handleModalAddSubmit}
        />
        {/* Edit / Delete Modal */}
        <AdminEditDeleteEventModal
          showModal={showEditDeleteModal}
          onHideModal={handleClearEventAndCloseEditDeleteModal}
          handleDeleteEvent={handleDeleteEvent}
          handleShowEditModal={handleShowEditModal}
        />
        {/* Edit Modal */}
        <AdminEditEventModal
          users={workers}
          eventTypes={eventTypes}
          selectedEvent={selectedEvent}
          showModal={showEditModal}
          onHideModal={handleCloseEditModal}
          handleSelectUser={handleSelectUser}
          handleSelectEventType={handleSelectEventType}
          handleSubmit={handleEditSubmit}
        />
        <div className="col-12 pt-3" />
      </div>
    </div>
  );
}
