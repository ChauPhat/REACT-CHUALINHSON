import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './BacHocModal.css';
import env from '../../env'
function BacHocModal({ show, handleClose, user, handleRoleChange}) {
  const [checkedCount, setCheckedCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [formData, setFormData] = useState({ ...user, gender: user.gender ? "Male" : "Female" });


  useEffect(() => {
    // Update formData when user data changes
    setFormData({ ...user, gender: user.gender ? "Male" : "Female" });
  }, [user]);

  const handleCheck = (event) => {
    const newCheckedCount = event.target.checked ? checkedCount + 1 : checkedCount - 1;
    setCheckedCount(newCheckedCount);
  };

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

  const handleGenderChange = (value) => {
    setFormData({
      ...formData,
      gender: value ? "Male" : "Female",
    });
  };

  const handleSave = () => {
    // Implement save logic here
    // Example: Call handleRoleChange or update state with new formData
    console.log('Saving data:', formData);

    setIsEditing(false); // Disable editing mode after saving
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Bậc Học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="avatar-container">
          <img src={` ${env.apiUrl}/api/file/get-img?userId=${user.id}&t=${Date.now()} `} alt="Avatar" className="user-avatar" />
        </div>

        <div className="form-group">
          <label htmlFor="name">Tên Bậc Học</label>
          <div className="input-group">
            <input
              id="name" name="name" className="form-control" type="text"
              value={formData.name} onChange={handleInputChange}
              readOnly={!isEditing} disabled={!isEditing}/>
          </div>

          <label htmlFor="phapdanh">Cấp Bậc</label>
          <input name="phapdanh" className="form-control" type="text"
            value={formData.phapdanh} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}/>

          <label htmlFor="address">Mô Tả</label>
          <textarea name="address" className="form-control" id="exampleFormControlTextarea1" rows="3"
            value={formData.address} onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="footer-container">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" 
            checked={isEditing} onChange={handleEditToggle}/>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Chỉnh Sửa</label>
          </div>
          <div className="footer-buttons">
            <Button variant="secondary"  disabled={!isEditing} onClick={handleSave}>
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

export default BacHocModal;
