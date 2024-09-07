import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ChucVuModal.css';
import env from '../../../env'

function AddChucVuModal({ show, handleClose, onAddChucVu }) {
  const [name, setName] = useState('');
  const [isHuynhTruong, setIsHuynhTruong] = useState(false); // State mới cho checkbox
  const [mota, setMota] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleCheckboxChange = () => {
    setIsHuynhTruong((prevValue) => !prevValue); // Toggle giá trị checkbox
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Tên Chức Vụ không được để trống.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    const formData = {
      roleName: name,
      isHuynhTruong,
      isActive : true,
    };

    try {
      const response = await axios.post(`${env.apiUrl}/api/role/insert`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const newChucVu = {
        id: response.data.data.ChucVuId,
        name,
        role: isHuynhTruong ? 'Huynh Trưởng' : 'Đoàn Sinh',
        status: true ? 'Active' : 'Inactive',
      };
      onAddChucVu(newChucVu);
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm chức vụ thành công!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
      });
      setName('');
      setIsHuynhTruong(false);
      handleClose();
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm chức vụ thất bại.',
        icon: 'error',
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thêm Chức Vụ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label htmlFor="name">Tên Chức Vụ</label>
          <input
            id="name"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            type="text"
            value={name}
            onChange={handleInputChange}
            required
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}

          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="isHuynhTruong"
              checked={isHuynhTruong}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="isHuynhTruong" >Huynh Trưởng?
            </label>
          </div>

        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddChucVuModal;
