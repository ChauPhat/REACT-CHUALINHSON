import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './UserModal.css';
import env from '../../../env'
function UserModal({ show, handleClose, user, handleRoleChange}) {
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
    // console.log('Saving data:', formData);

    setIsEditing(false); // Disable editing mode after saving
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Huynh Trưởng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="avatar-container">
          <img src={` ${env.apiUrl}/api/file/get-img?userId=${user.id}&t=${Date.now()} `} alt="Avatar" className="user-avatar" />
        </div>

        <div className="form-group">
          <label htmlFor="name">Họ Và Tên</label>
          <div className="input-group">
            <input
              id="name" name="name" className="form-control" type="text"
              value={formData.name} onChange={handleInputChange}
              readOnly={!isEditing} disabled={!isEditing}/>
            <span className="input-group-text" id="basic-addon2">{user.idUX}</span>
          </div>

          <label htmlFor="phapdanh">Pháp Danh</label>
          <input name="phapdanh" className="form-control" type="text"
            value={formData.phapdanh} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}/>

          <label htmlFor="email">Email</label>
          <input name="email" className="form-control" type="email"
            value={formData.email} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}/>

          <label htmlFor="registered">Ngày Sinh</label>
          <input name="registered" className="form-control" type="date"
            value={formData.birthDate} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}/>


          <label htmlFor="registered">Ngày Gia Nhập</label>
          <input name="registered" className="form-control" type="date"
            value={formData.registered} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}/>

          <label htmlFor="phone">Số Điện Thoại</label>
          <input  name="phone"  className="form-control" type="text" value={formData.phone} 
          onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing}/>

      <label>Giới Tính</label>
            <div className="radio-group">
            <label className="radio-inline">
              <input type="radio" name="gender" value="Male"
                checked={formData.gender === "Male"}
                onChange={() => handleGenderChange(true)}
                disabled={!isEditing} />
              Nam
            </label>
            <label className="radio-inline">
              <input type="radio" name="gender" value="Female"
                checked={formData.gender === "Female"} 
                onChange={() => handleGenderChange(false)}
                disabled={!isEditing} />
              Nữ
            </label>
            </div>

          <label htmlFor="address">Địa Chỉ</label>
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
            <Button className='custom-badge-success' variant="secondary" disabled={!isEditing} onClick={handleSave} >
              Save
            </Button>
            <Button className='custom-badge-danger' variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default UserModal;
