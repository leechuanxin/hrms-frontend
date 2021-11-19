/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable

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
            eventClick={(info) => handleShowEditDeleteModal(info.event)}
            events={events}
          />
        </div>
        {/* Add Modal */}
        <Modal show={showAddModal} onHide={setShowAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-12 mb-3">
              <label htmlFor="worker">
                <strong>Worker</strong>
              </label>
              <Form.Select id="worker" aria-label="Select a worker" onChange={handleSelectUser} defaultValue="DEFAULT">
                <option value="DEFAULT" disabled>Select a worker</option>
                {users.map((user) => (
                  <option value={user.user_id} key={`user${user.user_id}`}>{user.real_name}</option>
                ))}
              </Form.Select>
              <div className="invalid-feedback">Test</div>
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="eventtype">
                <strong>Event Type</strong>
              </label>
              <Form.Select id="eventtype" aria-label="Select an event type" onChange={handleSelectEventType} defaultValue="DEFAULT">
                <option value="DEFAULT" disabled>Select an event type</option>
                {eventTypes.map((eventType) => (
                  <option value={eventType} key={`eventType${eventType.charAt(0).toUpperCase() + eventType.substring(1)}`}>
                    {eventType.charAt(0).toUpperCase() + eventType.substring(1)}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleModalAddSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Edit / Delete Modal */}
        <Modal show={showEditDeleteModal} onHide={setShowEditDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit or Delete Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to edit or delete this event?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDeleteEvent}>
              Delete
            </Button>
            <Button variant="primary" onClick={handleShowEditModal}>
              Edit
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                handleClearSelectedEvent();
                handleCloseEditDeleteModal();
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={setShowEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-12 mb-3">
              <label htmlFor="worker">
                <strong>Worker</strong>
              </label>
              <Form.Select
                id="worker"
                aria-label="Select a worker"
                onChange={handleSelectUser}
                defaultValue={
                  (
                    (selectedEvent && selectedEvent.extendedProps)
                      ? selectedEvent.extendedProps.user_id
                      : 'DEFAULT'
                  )
                }
              >
                <option value="DEFAULT" disabled>Select a worker</option>
                {users.map((user) => (
                  <option
                    value={user.user_id}
                    key={`user${user.user_id}`}
                  >
                    {user.real_name}
                  </option>
                ))}
              </Form.Select>
              <div className="invalid-feedback">Test</div>
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="eventtype">
                <strong>Event Type</strong>
              </label>
              <Form.Select
                id="eventtype"
                aria-label="Select an event type"
                onChange={handleSelectEventType}
                defaultValue={
                  (
                    (selectedEvent && selectedEvent.extendedProps)
                      ? selectedEvent.extendedProps.type
                      : 'DEFAULT'
                  )
                }
              >
                <option value="DEFAULT" disabled>Select an event type</option>
                {eventTypes.map((eventType) => (
                  <option
                    value={eventType}
                    key={`eventType${eventType.charAt(0).toUpperCase() + eventType.substring(1)}`}
                  >
                    {eventType.charAt(0).toUpperCase() + eventType.substring(1)}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="col-12 pt-3" />
      </div>
    </div>
  );
}
