/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
import { Modal } from 'react-bootstrap';

export default function AdminEditDeleteEventModal({
  showModal, onHideModal, handleDeleteEvent, handleShowEditModal,
}) {
  return (
    <Modal show={showModal} onHide={onHideModal}>
      <Modal.Header>
        <Modal.Title>Edit or Delete Event</Modal.Title>
        <div>
          <button type="button" ariaLabel="Close" onClick={onHideModal}>X</button>
        </div>
      </Modal.Header>
      <Modal.Body>
        Do you want to edit or delete this event?
      </Modal.Body>
      <Modal.Footer>
        <button type="button" onClick={handleDeleteEvent}>
          Delete
        </button>
        <button type="button" onClick={handleShowEditModal}>
          Edit
        </button>
        <button
          type="button"
          onClick={onHideModal}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}
