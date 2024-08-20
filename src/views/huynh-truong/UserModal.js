import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function UserModal({ show, handleClose, user }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={user.avatar} alt="Avatar" className="img-fluid mb-3" style={{ width: '100px', borderRadius: '50%' }} />
        <h4>{user.name}</h4>
        <p>{user.email}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Save
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserModal;
