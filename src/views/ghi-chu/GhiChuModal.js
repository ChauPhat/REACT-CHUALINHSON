import React, { useState,useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import env from '../../env';
import Swal from 'sweetalert2';
import axios from 'axios';
import './GhiChuModal.css';

function BacHocModal({ show, handleClose, bachoc, onReloadTable  }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: bachoc.name || '',
    role: bachoc.role || '',
    mota: bachoc.mota || '',
  });
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [initialImageUrl, setInitialImageUrl] = useState('');


  useEffect(() => {
  
  }, [bachoc]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };





  const handleSave = async () => {


    const result = await Swal.fire({
      title: 'Xác nhận!',
      text: 'Bạn có chắc chắn muốn sửa bậc học này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, Sửa',
      cancelButtonText: 'Hủy',
    });
    
    if (result.isDenied || result.isDismissed) return;

    const BacHocData = {
      tenBacHoc: formData.name, // Mapping the formData to the expected field
      capBac: formData.role,    // Mapping the formData to the expected field
      moTa: formData.mota,      // Mapping the formData to the expected field
    };
    
    try {
      const response = await axios.put(`${env.apiUrl}/api/bac-hoc/updateBacHoc?bacHocId=${bachoc.id}`, BacHocData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm bậc học thành công!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
      });
      handleClose(); // Close the modal after successful save
      onReloadTable(); // Reload the data table after successful save
      setIsEditing(false); // Disable editing mode
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm bậc học thất bại.',
        icon: 'error',
      });
    }
    


    setIsEditing(false); // Disable editing mode after saving
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Bậc Học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="avatar-container">

        </div>

        <div className="form-group">
          <label htmlFor="name">Tên Ghi Chu</label>
          <input id="name" name="name"  className="form-control"
            type="text"  value={formData.name} onChange={handleInputChange}
          />

          <label htmlFor="mota">Mô Tả</label>
          <textarea name="mota" className="form-control" rows="3"
            value={formData.mota} onChange={handleInputChange}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="footer-container">
          <div className="form-check form-switch">
           
          </div>
          <div className="footer-buttons">
            <Button variant="success" onClick={handleSave}>
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
