/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function AdminEditDeleteEventModal({
  showModal, onHideModal, handleDeleteEvent, handleShowEditModal,
}) {
  return (
    <Modal show={showModal} onHide={onHideModal}>
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
          onClick={onHideModal}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
