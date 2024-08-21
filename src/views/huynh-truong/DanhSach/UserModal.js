import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './UserModal.css';  

function UserModal({ show, handleClose, user , handleRoleChange, handleGenderChange}) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="avatar-container">
          <img
            src={user.avatar}
            alt="Avatar"
            className="user-avatar"
          />
        </div>
   
        <div class="form-group">
        <label for="exampleFormControlInput1">Họ Và Tên</label>

        <div class="input-group ">
        <input class="form-control" type="text" value={user.name} readonly disabled/>
        <span class="input-group-text " id="basic-addon2">{user.id}</span>
        </div>

        <label for="exampleFormControlInput1">Pháp Danh</label>
        <input class="form-control" type="text" value={user.phapdanh} readonly disabled />

        <label for="exampleFormControlInput1">Email</label>
        <input class="form-control" type="email" value={user.email} readonly disabled/>

        <label for="exampleFormControlInput1">Ngày Gia Nhập</label>
        <input class="form-control" type="date" value={user.registered} readonly  /*định dạng YYYY-MM-DD*//> 

        <label for="exampleFormControlInput1">Chức Vụ</label>
        <select class="form-control" value={user.role}
            onChange={(e) => handleRoleChange(e.target.value)} disabled>
        <option value="true">Huynh Trưởng</option>
        <option value="false">Đoàn Sinh</option>
        </select>

        <label for="exampleFormControlInput1">Số Điện Thoại</label>
        <input class="form-control" type="text" placeholder={user.phone} readonly disabled/>

        <label for="exampleFormControlInput1">Giới Tính</label>
        <div class="radio-group"/>
        <label class="radio-inline" >
        <input type="radio" name="gender" value="male"  checked={user.gender === 'true'}
                onChange={() => handleGenderChange('male')}   readOnly/> Nam
        </label>
        <label class="radio-inline">
        <input type="radio" name="gender" value="female"  checked={user.gender === 'false'}
                onChange={() => handleGenderChange('female')}   readOnly/> Nữ
        </label>
        <label class="radio-inline">
        <input type="radio" name="gender" value="other"/> Khác
        </label>
        </div>

        <label for="exampleFormControlInput1">Địa Chỉ</label>
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={user.address} disabled></textarea>

      
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
