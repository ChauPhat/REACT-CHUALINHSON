import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './BacHocModal.css';
import env from '../../env';

function BacHocModal({ show, handleClose, bachoc }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: bachoc.name || '',
    role: bachoc.role || '',
    mota: bachoc.mota || '',
  });
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên Bậc Học không được để trống.';
    if (!formData.role.trim()) newErrors.role = 'Cấp Bậc không được để trống.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSave = async () => {
    if (!validateForm()) return;

    const result = await Swal.fire({
      title: 'Xác nhận!',
      text: 'Bạn có chắc chắn muốn sửa bậc học này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, S!',
      cancelButtonText: 'Hủy',
    });
    
    if (result.isDenied || result.isDismissed) return;

    try {
      const response = await axios.post(`${env.apiUrl}/api/bac-hoc/update`, formData, {
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
    


    setIsEditing(false); // Disable editing mode after saving
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Bậc Học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="avatar-container">
          <img
            src={`${env.apiUrl}/api/file/get-img?bachocId=${bachoc.id}&t=${Date.now()}`}
            alt="Avatar"
            className="bachoc-avatar"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Tên Bậc Học</label>
          <input id="name" name="name"  className="form-control"
            type="text"  value={formData.name} onChange={handleInputChange}
            disabled={!isEditing}/>
            
          <label htmlFor="role">Cấp Bậc</label>
          <input name="role" className="form-control"
            type="text" value={formData.role} onChange={handleInputChange}
            disabled={!isEditing}/>

          <label htmlFor="mota">Mô Tả</label>
          <textarea name="mota" className="form-control" rows="3"
            value={formData.mota} onChange={handleInputChange}
            disabled={!isEditing}
          ></textarea>
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

export default BacHocModal;
