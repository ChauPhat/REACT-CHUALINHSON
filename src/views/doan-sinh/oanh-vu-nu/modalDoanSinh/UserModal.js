
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

  const handleSave = () => {
    // Save logic goes here (e.g., API call or local state update)
    setIsEditing(false); // Disable editing mode after saving
    // You might want to call handleRoleChange or other handlers here to save changes
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Đoàn Sinh</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="avatar-container">
          <img src={user.avatar} alt="Avatar" className="user-avatar" />
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

          <label for="exampleFormControlInput1">Giới Tính</label>
          <div class="radio-group">
            <label class="radio-inline">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'true'}
                onChange={() => isEditing && handleInputChange({ target: { name: 'gender', value: 'male' } })}
                readOnly={!isEditing}
                disabled
              /> Nam
            </label>
            <label class="radio-inline">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'false'}
                onChange={() => isEditing && handleInputChange({ target: { name: 'gender', value: 'female' } })}
                readOnly={!isEditing}
                disabled
              /> Nữ
            </label>
            <label class="radio-inline">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === 'other'}
                onChange={() => isEditing && handleInputChange({ target: { name: 'gender', value: 'other' } })}
                readOnly={!isEditing}
                disabled
              /> Khác
            </label>
          </div>

          <label for="exampleFormControlInput1">Địa Chỉ</label>
          <textarea id='diachi' name='diachi' class="form-control" rows="3" value={formData.address}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing}></textarea>

          <label for="exampleFormControlInput1">Số Điện Thoại Gia Đình</label>
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
