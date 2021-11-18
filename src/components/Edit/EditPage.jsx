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
  const [scheduleTypes] = useState(['shift', 'leave']);
  const [events, setEvents] = useState([
    { title: '', date: '2021-11-03', extendedProps: { user_id: 1, real_name: 'Lee Chuan Xin', type: 'shift' } },
    { title: '', date: '2021-11-07', extendedProps: { user_id: 1, real_name: 'Lee Chuan Xin', type: 'leave' } },
  ]);
  const [currentDate, setCurrentDate] = useState('');
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedScheduleType, setSelectedScheduleType] = useState('');

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

  const handleCloseFirstModal = () => {
    setCurrentDate('');
    setShowFirstModal(false);
    setSelectedUser(null);
    setSelectedScheduleType('');
  };
  const handleShowFirstModal = (arg) => {
    setCurrentDate(arg.dateStr);
    setShowFirstModal(true);
  };

  const handleModalSubmit = () => {
    const userSelected = { ...selectedUser };
    const currentEvents = [...events];
    // get all events on selected day
    const currentDayEvents = currentEvents.filter(
      (currentEvent) => currentEvent.date === currentDate,
    );
    if (userSelected.user_id && selectedScheduleType.trim() !== '' && currentDayEvents.length < 1) {
      const newEvent = {
        title: `${userSelected.real_name}'s ${selectedScheduleType.substring(0, 1).toUpperCase()}${selectedScheduleType.substring(1)}`,
        date: currentDate,
        classNames: (selectedScheduleType === 'shift')
          ? [`shift-block-${Number(userSelected.user_id) % 50}`]
          : ['leave-block'],
        extendedProps: {
          user_id: userSelected.user_id,
          real_name: userSelected.real_name,
          type: selectedScheduleType,
        },
      };
      setEvents((oldEvents) => ([...oldEvents, newEvent]));
    }

    handleCloseFirstModal();
  };

  const handleSelectUser = (e) => {
    const selected = users.filter((user) => user.user_id === Number(e.target.value))[0];
    setSelectedUser(selected);
  };

  const handleSelectScheduleType = (e) => {
    const selected = scheduleTypes.filter((scheduleType) => scheduleType === e.target.value)[0];
    setSelectedScheduleType(selected);
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
            dateClick={handleShowFirstModal}
            events={events}
          />
        </div>
        <Modal show={showFirstModal} onHide={setShowFirstModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Schedule</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-12 mb-3">
              <label htmlFor="worker">
                <strong>Worker</strong>
              </label>
              <Form.Select id="worker" aria-label="Select a worker" onChange={handleSelectUser}>
                <option>Select a worker</option>
                {users.map((user) => (
                  <option value={user.user_id} key={`user${user.user_id}`}>{user.real_name}</option>
                ))}
              </Form.Select>
              <div className="invalid-feedback">Test</div>
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="scheduletype">
                <strong>Schedule Type</strong>
              </label>
              <Form.Select id="scheduletype" aria-label="Select a schedule type" onChange={handleSelectScheduleType}>
                <option>Select a schedule type</option>
                {scheduleTypes.map((scheduleType) => (
                  <option value={scheduleType} key={`scheduleType${scheduleType.charAt(0).toUpperCase() + scheduleType.substring(1)}`}>
                    {scheduleType.charAt(0).toUpperCase() + scheduleType.substring(1)}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseFirstModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleModalSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="col-12 pt-3" />
      </div>
    </div>
  );
}
