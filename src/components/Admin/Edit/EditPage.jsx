/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
// CUSTOM IMPORTS
import AdminAddEventModal from './Modals/AdminAddEventModal.jsx';
import AdminEditDeleteEventModal from './Modals/AdminEditDeleteEventModal.jsx';
import AdminEditEventModal from './Modals/AdminEditEventModal.jsx';

export default function EditPage() {
  const [users] = useState([
    {
      user_id: 1,
      real_name: 'Lee Chuan Xin',
    },
    {
      user_id: 2,
      real_name: 'Wong Shen Nan',
    },
    {
      user_id: 3,
      real_name: 'Chiew Jia En',
    },
    {
      user_id: 4,
      real_name: 'Justin Wong',
    },
    {
      user_id: 5,
      real_name: 'Akira Wong',
    },
  ]);
  const [eventTypes] = useState(['shift', 'leave']);
  const [events, setEvents] = useState([
    {
      title: '',
      date: '2021-11-03',
      extendedProps: {
        id: 1, user_id: 1, real_name: 'Lee Chuan Xin', type: 'shift', date: '2021-11-03',
      },
    },
    {
      title: '',
      date: '2021-11-07',
      extendedProps: {
        id: 2, user_id: 1, real_name: 'Lee Chuan Xin', type: 'leave', date: '2021-11-07',
      },
    },
  ]);
  const [currentDate, setCurrentDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditDeleteModal, setShowEditDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

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
    const selected = users.filter((user) => user.user_id === Number(e.target.value))[0];
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
          ...users[0],
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

  return (
    <div className="container-fluid pt-5">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1">
          <FullCalendar
            plugins={[interactionPlugin, dayGridPlugin]}
            initialView="dayGridMonth"
            editable
            selectable
            dateClick={handleShowAddModal}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            events={events}
          />
        </div>
        {/* Add Modal */}
        <AdminAddEventModal
          users={users}
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
          users={users}
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
