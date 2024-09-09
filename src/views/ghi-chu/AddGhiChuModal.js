import React, { useState,useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import env from '../../env';
import './GhiChuModal.css';

function AddGhiChuModal({ show, handleClose, }) {
    const [name, setName] = useState('');

    const [mota, setMota] = useState('');
    const [errors, setErrors] = useState({});


const handleSave = async () => {
  if (!validateForm()) return;

  const result = await Swal.fire({
    title: 'Xác nhận!',
    text: 'Bạn có chắc chắn muốn thêm bậc học này không?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Có, thêm!',
    cancelButtonText: 'Hủy',
  });

  if (result.isDenied || result.isDismissed) return;

  const formData = {
    tenBacHoc: name,
    moTa: mota,
  };

  try {
    // First API call to add Bac Hoc
    const response = await axios.post(`${env.apiUrl}/api/bac-hoc/insert`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });


    // Only proceed if both actions succeed
    const newBacHoc = {
      id: response.data.data.bacHocId,
      name,
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
    // Reset form fields after successful save
    setName('');

    setMota('');

    handleClose();
  } catch (error) {
    // Handle error when adding Bac Hoc
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
            <Modal.Title className="modal-title">Thêm Ghi Chú</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="form-group">
            <label htmlFor="name">Tên Ghi Chú</label>
            <input id="name" name="name" className="form-control"
            type="text" value={name} /> 

            <label htmlFor="mota">Mô Tả</label>
            <textarea name="mota" className="form-control"
            rows="5" value={mota} 
            required ></textarea>

            </div>
        </Modal.Body>
        <Modal.Footer>
            <div className="footer-container">
            <div className="form-check form-switch">
            </div>
            <div className="footer-buttons">
              <Button variant="success" onClick={handleSave} >
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

export default AddGhiChuModal;
