import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import './BacHocModal.css';
import env from '../../env';

function AddBacHocModal({ show, handleClose, onAddBacHoc  }) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [mota, setMota] = useState('');
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') setName(value);
        if (name === 'role') setRole(value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
      };

    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Tên Bậc Học không được để trống.';
        if (!role.trim()) newErrors.role = 'Cấp Bậc không được để trống.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }; 

   const handleSave = async () => {
    if (!validateForm()) return;
    const formData = {
      tenBacHoc: name,
      capBac: role,
      moTa: mota,
    };

    try {
      const response = await axios.post(`${env.apiUrl}/api/bac-hoc/insert`, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      const newBacHoc = {
        id: response.data.data.bacHocId, // Assuming the response returns the new bacHocId
        name,
        role,
        mota,
      };
      onAddBacHoc(newBacHoc);
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm bậc học thành công!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
      });
      setName('');
      setRole('');
      setMota('');
      // Close modal after successful save
      handleClose();
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm bậc học thất bại.',
        icon: 'error',
      });
    }
  };


    return (
        <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title className="modal-title">Thêm Bậc Học</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="avatar-container">
            
            </div>

            <div className="form-group">
            <label htmlFor="name">Tên Bậc Học</label>
            <input id="name" name="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            type="text" value={name} onChange={handleInputChange} required/>
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}   

            <label htmlFor="role">Cấp Bậc</label>
            <input name="role" className={`form-control ${errors.role ? 'is-invalid' : ''}`} type="text"
            value={role} onChange={handleInputChange} required/>
            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
            
            <label htmlFor="mota">Mô Tả</label>
            <textarea name="mota" className="form-control"
            rows="3" value={mota} onChange={handleInputChange}
            required ></textarea>

            </div>
        </Modal.Body>
        <Modal.Footer>
            <div className="footer-container">
            <div className="form-check form-switch">
            </div>
            <div className="footer-buttons">
                <Button variant="secondary" onClick={handleSave} >
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

export default AddBacHocModal;
