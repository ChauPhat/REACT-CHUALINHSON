import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../DoanSinhCss/InsertModal.css';
import env from '../../../../env';
import { CFormInput, CFormSelect } from '@coreui/react';
import axios from 'axios';
import Swal from 'sweetalert2';

function InsertModal({ show, handleClose }) {
  const [roles, setRoles] = useState([]);
  const [bacHoc, setBacHoc] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    hoTen: '',
    ngaySinh: '',
    sdt: '',
    email: '',
    phapDanh: '',
    gioiTinh: true,
    createdDate: '',
    isHuynhTruong: false,
    updatedDate: '',
    diaChi: '',
    sdtGd: '',
    avatar: '',
    isActive: true,
    roleId1: '',
    lichSuHocs: [] // Đổi từ null thành mảng rỗng
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse, bacHocResponse] = await Promise.all([
          axios.get(`${env.apiUrl}/api/role/get-all`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
          }),
          axios.get(`${env.apiUrl}/api/bac-hoc/get-all`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
          })
        ]);

        if (rolesResponse.data.status === 'OK') {
          const filteredRoles = rolesResponse.data.data.filter(
            (role) => !role.isHuynhTruong && role.doanId === 3
          );
          setRoles(filteredRoles);
        } else {
          console.error('Lỗi khi lấy dữ liệu roles:', rolesResponse.data.message);
        }

        if (bacHocResponse.data.status === 'OK') {
          const filteredBacHoc = bacHocResponse.data.data.filter(
            (bac) => bac.capBac === "Đoàn Sinh"
          );
          setBacHoc(filteredBacHoc);
        } else {
          console.error('Lỗi khi lấy dữ liệu Bậc Học:', bacHocResponse.data.message);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prevData => {
      switch (name) {
        case "roleId1":
          return { ...prevData, [name]: { roleId: value } };

        case "gioiTinh":
          return { ...prevData, [name]: value === "true" };
        case "bacHoc":
          return { ...prevData, lichSuHocs: [{ bacHocId: value }] };
        default:
          return { ...prevData, [name]: value };
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validExtensions.includes(file.type)) {
        Swal.fire({
          title: "Thông báo từ hệ thống!",
          text: "Đây không phải file ảnh, vui lòng chọn lại.",
          icon: "warning"
        });
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setFormData(prevFormData => ({
        ...prevFormData,
        avatar: file
      }));
    }
  };

  const handleSave = async () => {
    const { hoTen, ngaySinh, sdt, email, roleId1 } = formData;
    if (!hoTen || !ngaySinh || !sdt || !email || !roleId1) {
      Swal.fire({
        title: "Lỗi!",
        text: "Các trường bắt buộc không được để trống!",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }
    try {
      const response = await axios.post(`${env.apiUrl}/api/users/createUser`, formData, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });

      if (response.data.status === 'OK') {
        Swal.fire({
          title: "Thành công!",
          text: "Đoàn sinh đã được thêm thành công!",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
          handleClose();
        });
      } else {
        Swal.fire({
          title: "Lỗi!",
          text: `Lỗi khi thêm đoàn sinh: ${response.data.message}`,
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Lỗi hệ thống!",
        text: "Có lỗi xảy ra khi gọi API.",
        icon: "error",
        confirmButtonText: "OK"
      });
      console.error('Lỗi khi gọi API:', error);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Modal scrollable show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Đoàn Sinh</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="avatar-container text-center mb-3">
          <img
            src={avatarPreview}
            alt="User Avatar"
            onClick={handleAvatarClick}
            style={{ width: '100px', height: '100px', borderRadius: '50%', cursor: 'pointer' }}
          />
          <CFormInput
            type="file"
            className="mb-3"
            style={{ display: 'none' }}
            accept=".jpg,.jpeg,.png"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <label>Họ Và Tên</label>
          <input id="name" name="hoTen" value={formData.hoTen} className="form-control" type="text" onChange={handleChange} />

          <label>Pháp Danh</label>
          <input id="phapdanh" name="phapDanh" value={formData.phapDanh} className="form-control" type="text" onChange={handleChange} />

          <label>Ngày Sinh</label>
          <input id="ngaysinh" name="ngaySinh" value={formData.ngaySinh} className="form-control" type="date" onChange={handleChange} />

          <label>Số Điện Thoại</label>
          <input id="phone" name="sdt" value={formData.sdt} className="form-control" type="text" onChange={handleChange} />

          <label>Email</label>
          <input id="email" name="email" value={formData.email} className="form-control" type="email" onChange={handleChange} />

          <label>Địa Chỉ</label>
          <textarea id='diachi' name='diaChi' value={formData.diaChi} className="form-control" rows="3" onChange={handleChange}></textarea>

          <label>Số Điện Thoại Người Dám Hộ</label>
          <input id="sdtgd" name="sdtGd" value={formData.sdtGd} className="form-control" type="text" onChange={handleChange} />

          <label>Giới Tính</label>
          <div className="mb-3">
            <label className="form-check-label">
              <input
                type="radio"
                name="gioiTinh"
                value="true"
                checked={formData.gioiTinh === true}
                onChange={handleChange}
                className="form-check-input"
              /> Nam
            </label>
            <label className="form-check-label ml-3">
              <input
                type="radio"
                name="gioiTinh"
                value="false"
                checked={formData.gioiTinh === false}
                onChange={handleChange}
                className="form-check-input"
              /> Nữ
            </label>
          </div>
          <label>Bậc Học</label>
          <CFormSelect name="bacHoc" onChange={handleChange}>
            <option value="">Chọn Bậc Học</option>
            {bacHoc.map(bac => (
              <option key={bac.bacHocId} value={bac.bacHocId}>
                {bac.tenBacHoc}
              </option>
            ))}
          </CFormSelect>

          <label>Chức Vụ</label>
          <CFormSelect name="roleId1" onChange={handleChange}>
            <option value="">Chọn Chức Vụ</option>
            {roles.map((role) => (
              <option key={role.roleId} value={role.roleId}>
                {role.roleName}
              </option>
            ))}
          </CFormSelect>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='custom-badge-success' variant="secondary" onClick={handleSave}>
          Save
        </Button>
        <Button className='custom-badge-danger' variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InsertModal;
