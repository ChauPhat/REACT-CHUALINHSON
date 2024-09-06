import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ChucVuModal.css';
import env from '../../../env'

function ChucVuModal({ show, handleClose, ChucVu }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: ChucVu.name || '',
    role: ChucVu.role || '',
    mota: ChucVu.mota || '',
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    // Implement save logic here
    // console.log('Saving data:', formData);
    setIsEditing(false); // Disable editing mode after saving
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Chức Vụ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      

        <div className="form-group">
          <label htmlFor="name">Tên Bậc Học</label>
          <input id="name" name="name"  className="form-control"
            type="text"  value={formData.name} onChange={handleInputChange}
            disabled={!isEditing}/>
            
          <label htmlFor="role">Cấp Bậc</label>
          <input name="role" className="form-control"
            type="text" value={formData.role} onChange={handleInputChange}
            disabled={!isEditing}/>

          <label htmlFor="mota">Mô Tả</label>
          <textarea name="mota" className="form-control" rows="3"
            value={formData.mota} onChange={handleInputChange}
            disabled={!isEditing}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="footer-container">
          <div className="form-check form-switch">
            <input className="form-check-input"
              type="checkbox" id="flexSwitchCheckDefault"
              checked={isEditing} onChange={handleEditToggle} />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
              Chỉnh Sửa
            </label>
          </div>
          <div className="footer-buttons">
            <Button variant="secondary" disabled={!isEditing} onClick={handleSave}>
              Save
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default ChucVuModal;
