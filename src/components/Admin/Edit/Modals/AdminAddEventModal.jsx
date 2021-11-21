/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function AdminAddEventModal({
  users, eventTypes, showModal, onHideModal, handleSelectUser, handleSelectEventType, handleSubmit,
}) {
  return (
    <Modal show={showModal} onHide={onHideModal}>
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
        <Button variant="secondary" onClick={onHideModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
