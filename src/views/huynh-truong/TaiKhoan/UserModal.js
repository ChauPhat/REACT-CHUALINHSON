import React, { useState,useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './UserModal.css';  



function UserModal({ show, handleClose, user , handleRoleChange}) {
  
  const [checkedCount, setCheckedCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user, gender: user.gender ? "Male" : "Female" });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Update formData when user data changes
    setFormData({ ...user, gender: user.gender ? "Male" : "Female" });
    const initialRoles = formData.roleOfDoanTruong ? [formData.roleOfDoanTruong] : [];
    setRoles(initialRoles);
    setCheckedCount(initialRoles.length);
  }, [user]);


  const handleCheck = (event) => {
    const { id, checked } = event.target;
    const roleId = parseInt(id.replace('check', ''), 10);

    let newCheckedCount = checkedCount;

    if (checked) {
      newCheckedCount += 1;
      setRoles([...roles, roleId]);
    } else {
      newCheckedCount -= 1;
      setRoles(roles.filter(role => role !== roleId));
    }

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

  const rolesMapping = {
    ROLE_ADMIN: "Admin",
    ROLE_THUKY: "Thư ký",
    ROLE_THUQUY: "Thủ quỹ",
    ROLE_DOANTRUONG: "Đoàn trưởng",
    ROLE_DOANTRUONG_OANHVUNAM: "Đoàn trưởng Oanh Vũ Nam",
    ROLE_DOANTRUONG_OANHVUNU: "Đoàn trưởng Oanh Vũ Nữ",
    ROLE_DOANTRUONG_THIEUNAM: "Đoàn trưởng Thiếu Nam",
    ROLE_DOANTRUONG_THIEUNU: "Đoàn trưởng Thiếu Nữ",
    ROLE_DOANTRUONG_NGANHTHANH: "Đoàn trưởng Ngành Thanh"
  };


  const handleGenderChange = (value) => {
    setFormData({
      ...formData,
      gender: value ? "Male" : "Female",
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Tài Khoản</Modal.Title>
      </Modal.Header>
    <Modal.Body>
      <div className="avatar-container">
        <img src={`../../../../src/assets/images/avatars/`+user.avatar} alt="Avatar" className="user-avatar" />
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

      <label htmlFor="roles">Chức Vụ</label>
          <div className="checkbox-container">
            {Object.keys(rolesMapping).map(key => (
              <div className="form-check" key={key}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`check${key}`}
                  checked={roles.includes(key)}
                  onChange={handleCheck}
                  disabled={!isEditing || (checkedCount >= 2 && !roles.includes(key))}
                />
                <label className="form-check-label" htmlFor={`check${key}`}>
                  {rolesMapping[key]}
                </label>
              </div>
            ))}
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
      <Button variant="danger" onClick={handleClose}>
        Close
      </Button>
    </div>
  </div>
      </Modal.Footer>
    </Modal>
  );
}

export default UserModal;
