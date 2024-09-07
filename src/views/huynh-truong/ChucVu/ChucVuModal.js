import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ChucVuModal.css';
import env from '../../../env'
import axios from 'axios';
import Swal from 'sweetalert2';

function ChucVuModal({ show, handleClose, ChucVu, onUpdateChucVu }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: ChucVu.name || '',
  });
  const [isHuynhTruong, setIsHuynhTruong] = useState(ChucVu.role === 'Huynh Trưởng' ? true : false);

  const handleCheckboxChange = () => {
    setIsHuynhTruong((prevValue) => !prevValue); // Toggle giá trị checkbox
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

  const handleSave = async () => {
    const updatedRole = {
      roleName: formData.name,
      isHuynhTruong: isHuynhTruong, // Set role based on checkbox
      isActive: ChucVu.stasus === 'Active' ? true : false,
    };
    try {
      const response = await axios.put(`${env.apiUrl}/api/role/${ChucVu.id}`, updatedRole, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const updatedData = {
        ...ChucVu,
        name: formData.name,
        role: isHuynhTruong ? 'Huynh Trưởng' : 'Đoàn Sinh',
      };
      onUpdateChucVu(updatedData);
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Cập nhật chức vụ thành công!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
      });
      setIsEditing(false);
      handleClose();
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('Cập nhật chức vụ thất bại.');
    }
  };


  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Chức Vụ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label htmlFor="name">Tên Bậc Học</label>
          <input id="name" name="name" className="form-control"
            type="text" value={formData.name} onChange={handleInputChange}
            disabled={!isEditing} />

          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="isHuynhTruong"
              checked={isHuynhTruong}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
            />
            <label className="form-check-label" htmlFor="isHuynhTruong" >Huynh Trưởng?
            </label>
          </div>
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
