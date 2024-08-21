import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './UserModal.css';  



function UserModal({ show, handleClose, user , handleRoleChange, handleGenderChange}) {
  
  const [checkedCount, setCheckedCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [formData, setFormData] = useState(user); // Local state for form data

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

  const handleSave = () => {
    // Save logic goes here (e.g., API call or local state update)
    setIsEditing(false); // Disable editing mode after saving
    // You might want to call handleRoleChange or other handlers here to save changes
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">User Profile</Modal.Title>
      </Modal.Header>
    <Modal.Body>
      <div className="avatar-container">
        <img src={user.avatar} alt="Avatar" className="user-avatar" />
      </div>
   
    <div class="form-group">
      <label for="exampleFormControlInput1">Họ Và Tên</label>
    <div class="input-group">
    <input  id="name" name="name"class="form-control" type="text" value={formData.name}
    onChange={handleInputChange} readOnly={!isEditing}  disabled={!isEditing}/>
    <span class="input-group-text " id="basic-addon2">{user.id}</span>
    </div>

    <label for="exampleFormControlInput1">User Name</label>
    <input id="userName" name="userName" class="form-control" type="text" value={formData.userName} 
    onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing}/>

    <label for="exampleFormControlInput1">Password</label>
    <input id="password" name="password" class="form-control" type="password" value={formData.password} 
    onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing}/>

    <label for="exampleFormControlInput1">Email</label>
    <input id="email" name="email" class="form-control" type="email" value={formData.email} 
    onChange={handleInputChange}  readonly={!isEditing} disabled={!isEditing}/>


    <label for="exampleFormControlInput1">Chức Vụ</label>
    <div className="checkbox-container">
    <div className="form-check">
    <input className="form-check-input" type="checkbox" id="check1" onChange={handleCheck} 
    disabled={checkedCount >= 2 && !document.getElementById('check1').checked} />
        <label className="form-check-label" htmlFor="check1">
          Admin
        </label>
      </div>
    <div className="form-check">
    <input className="form-check-input" type="checkbox" id="check2" onChange={handleCheck} 
    disabled={checkedCount >= 2 && !document.getElementById('check2').checked} />
      <label className="form-check-label" htmlFor="check2">
        Thư Ký
      </label>
      </div>
    <div className="form-check">
    <input className="form-check-input" type="checkbox" id="check3" onChange={handleCheck} 
    disabled={checkedCount >= 2 && !document.getElementById('check3').checked} />
      <label className="form-check-label" htmlFor="check3">
        Thủ Quỹ
      </label>
    </div>
    <div className="form-check">
    <input className="form-check-input" type="checkbox" id="check4" onChange={handleCheck} 
    disabled={checkedCount >= 2 && !document.getElementById('check4').checked} />
      <label className="form-check-label" htmlFor="check4">
          Đoàn Trưởng Thiếu Nam
      </label>
    </div>
    <div className="form-check">
    <input className="form-check-input" type="checkbox" id="check5" onChange={handleCheck} 
    disabled={checkedCount >= 2 && !document.getElementById('check5').checked} />
      <label className="form-check-label" htmlFor="check4">
        Đoàn Trưởng Thiếu Nam
      </label>
    </div>
    <div className="form-check">
    <input className="form-check-input" type="checkbox" id="check6" onChange={handleCheck} 
    disabled={checkedCount >= 2 && !document.getElementById('check6').checked} />
        <label className="form-check-label" htmlFor="check4">
        Đoàn Trưởng Thiếu Nữ
        </label>
      </div>
      </div>

      <label for="exampleFormControlInput1">Ngày Tạo</label>
      <input  id="registered"name="registered"class="form-control" type="date" value={formData.registered}  
      onChange={handleInputChange}  readonly={!isEditing}  disabled={!isEditing}
      /*định dạng YYYY-MM-DD*//> 
      </div>

      </Modal.Body>
      <Modal.Footer>
    <div className="footer-container">
    <div className="form-check form-switch" >
      <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={isEditing} onChange={handleEditToggle}/>
      <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Chỉnh Sửa</label>
    </div>
    <div className="footer-buttons">
      <Button variant="secondary" disabled={!isEditing} >
        Save
      </Button>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
    </div>
  </div>
      </Modal.Footer>
    </Modal>
  );
}

export default UserModal;
