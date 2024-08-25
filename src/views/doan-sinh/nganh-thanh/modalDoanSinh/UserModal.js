
// export default UserModal;
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../DoanSinhCss/UserModal.css';

function UserModal({ show, handleClose, user, handleRoleChange, handleGenderChange }) {

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

  const getGenderLabel = (gender) => {
    switch (gender) {
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      case 'other':
        return 'Khác';
      default:
        return 'Không xác định';
    }
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
          <img src={`../../../../src/assets/images/avatars/`+ user.avatar} alt="Avatar" className="user-avatar" />
        </div>

        <div class="form-group">
          <label for="exampleFormControlInput1">Họ Và Tên</label>
          <div class="input-group">
            <input id="name" name="name" class="form-control" type="text" value={formData.name}
              onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing} />
            <span class="input-group-text " id="basic-addon2">{user.id}</span>
          </div>

          <label for="exampleFormControlInput1">Pháp Danh</label>
          <input id="phapdanh" name="phapdanh" class="form-control" type="text" value={formData.phapDanh}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing} />

          <label for="exampleFormControlInput1">Email</label>
          <input id="email" name="email" class="form-control" type="email" value={formData.email}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing} />

          <label for="exampleFormControlInput1">Đoàn</label>
          <input id="doan" name="doan" class="form-control" type="text" value={formData.doan}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing} />

          <label for="exampleFormControlInput1">Chức Vụ</label>
          <input id="role" name="role" class="form-control" type="text" value={formData.role}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing} />

          <label for="exampleFormControlInput1">Ngày Sinh</label>
          <input id="ngaysinh" name="ngaysinh" class="form-control" type="Date" value={formData.ngaysinh}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing} />

          <label for="exampleFormControlInput1">Ngày Đăng Kí</label>
          <input id="registered" name="registered" class="form-control" type="Date" value={formData.registered}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing}
      /*định dạng YYYY-MM-DD*/ />

          <label for="exampleFormControlInput1">Số Điện Thoại</label>
          <input id="phone" name="phone" class="form-control" type="text" value={formData.phone}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing} />

          <label htmlFor="gender">Giới Tính</label>
          <div className="radio-group">
            <label className="radio-inline">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleInputChange}
                readOnly={!isEditing}
                disabled={!isEditing}
              /> Nam
            </label>
            <label className="radio-inline">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleInputChange}
                readOnly={!isEditing}
                disabled={!isEditing}
              /> Nữ
            </label>
            <label className="radio-inline">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === 'other'}
                onChange={handleInputChange}
                readOnly={!isEditing}
                disabled={!isEditing}
              /> Khác
            </label>
          </div>


          <label for="exampleFormControlInput1">Địa Chỉ</label>
          <textarea id='diachi' name='diachi' class="form-control" rows="3" value={formData.address}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing}></textarea>

          <label for="exampleFormControlInput1">Số Điện Thoại Người Dám Hộ</label>
          <input id="sdtgd" name="sdtgd" class="form-control" type="text" value={formData.sdtgd}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing} />

          <label for="exampleFormControlInput1">Ngày Gia Nhập Đoàn</label>
          <input id="ngayGiaNhapDoan" name="ngayGiaNhapDoan" class="form-control" type="Date" value={formData.ngayGiaNhapDoan}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing} />

          <label for="exampleFormControlInput1">Ngày Rời Đoàn</label>
          <input id="ngayRoiDoan" name="ngayRoiDoan" class="form-control" type="Date" value={formData.ngayRoiDoan}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing} />

          <label for="exampleFormControlInput1">Mô Tả</label>
          <textarea id='mota' name='mota' class="form-control" rows="3" value={formData.mota}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing}></textarea>

        </div>

      </Modal.Body>
      <Modal.Footer>
        <div className="footer-container">
          <div className="form-check form-switch" >
            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={isEditing} onChange={handleEditToggle} />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Chỉnh Sửa</label>
          </div>
          <div className="footer-buttons">
            <Button className='custom-badge-success' variant="secondary" disabled={!isEditing} >
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
