/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
import { Modal } from 'react-bootstrap';

export default function AdminEditEventModal({
  eventTypes,
  selectedEvent,
  showModal,
  onHideModal,
  handleSelectEventType,
  handleSubmit,
}) {
  return (
    <Modal show={showModal} onHide={onHideModal}>
      <Modal.Header>
        <Modal.Title>Edit Event</Modal.Title>
        <div>
          <button type="button" ariaLabel="Close" onClick={onHideModal}>X</button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="col-12 mb-3">
          <label htmlFor="eventtype">
            <strong>Event Type</strong>
          </label>
          <div>
            <select
              className="w-100"
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
            </select>
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
