/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
import { Modal } from 'react-bootstrap';

export default function AdminAddEventModal({
  users, eventTypes, showModal, onHideModal, handleSelectUser, handleSelectEventType, handleSubmit,
}) {
  return (
    <Modal show={showModal} onHide={onHideModal}>
      <Modal.Header>
        <Modal.Title>Add Event</Modal.Title>
        <div>
          <button type="button" ariaLabel="Close" onClick={onHideModal}>X</button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="window-body">
          <div className="col-12 mb-3">
            <label htmlFor="worker">
              <strong>Worker</strong>
            </label>
            <div>
              <select className="w-100" id="worker" aria-label="Select a worker" onChange={handleSelectUser} defaultValue="DEFAULT">
                <option value="DEFAULT" disabled>Select a worker</option>
                {users.map((user) => (
                  <option value={user.id} key={`user${user.id}`}>{user.realName}</option>
                ))}
              </select>
            </div>
            <div className="invalid-feedback">Test</div>
          </div>
          <div className="col-12 mb-3">
            <label htmlFor="eventtype">
              <strong>Event Type</strong>
            </label>
            <div>
              <select className="w-100" id="eventtype" aria-label="Select an event type" onChange={handleSelectEventType} defaultValue="DEFAULT">
                <option value="DEFAULT" disabled>Select an event type</option>
                {eventTypes.map((eventType) => (
                  <option value={eventType} key={`eventType${eventType.charAt(0).toUpperCase() + eventType.substring(1)}`}>
                    {eventType.charAt(0).toUpperCase() + eventType.substring(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" onClick={onHideModal}>
          Close
        </button>
        <button type="button" onClick={handleSubmit}>
          Save Changes
        </button>
      </Modal.Footer>
    </Modal>
  );
}
