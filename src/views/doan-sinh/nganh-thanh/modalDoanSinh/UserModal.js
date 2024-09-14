import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../DoanSinhCss/UserModal.css';
import env from '../../../../env';
import { CFormInput, CFormSelect } from '@coreui/react';
import Swal from 'sweetalert2';
import axios from 'axios';

function UserModal({ show, handleClose, user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user, gender: user.gender ? "Male" : "Female" });
  const [roles, setRoles] = useState([]);
  const [bacHoc, setBacHoc] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
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
            (role) => !role.isHuynhTruong && role.doanId === 5
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

  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      roleId1: roles.find(role => role.roleId === prevFormData.roleId1?.roleId) || null,
    }));
  }, [roles]);

  const handleEditToggle = () => {
    setIsEditing(prevState => !prevState);
  };

  const handleGenderChange = (value) => {
    setFormData({
      ...formData,
      gender: value ? "Male" : "Female",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
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
      setSelectedFile(file);
      setFormData(prevFormData => ({
        ...prevFormData,
        avatar: URL.createObjectURL(file),
      }));
    }
  };

  const handleSave = async () => {
    if (selectedFile) {
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);

      try {
        const response = await axios.post(`${env.apiUrl}/api/file/upload-img?userId=${user.id}`, uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        Swal.fire({
          title: "Thông báo từ hệ thống!",
          text: "Cập nhật ảnh thành công",
          icon: "success"
        });
      } catch (error) {
        Swal.fire({
          title: "Thông báo từ hệ thống!",
          text: "Cập nhật ảnh thất bại.",
          icon: "error"
        });
      }
    }
    setIsEditing(false);
    handleClose(); // Đóng modal sau khi lưu
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
            src={formData.avatar}
            alt="User Avatar"
            style={{ width: '100px', height: '100px', borderRadius: '50%', cursor: 'pointer' }}
            onClick={handleAvatarClick}
            readOnly={!isEditing} disabled={!isEditing}
          />
          <CFormInput
            type="file"
            className="mb-3"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
            readOnly={!isEditing} disabled={!isEditing}
            accept=".jpg,.jpeg,.png"
          />
        </div>
        <div className="form-group">
          <label>Họ Và Tên</label>
          <div className="input-group">
            <input
              id="name" name="name" className="form-control" type="text"
              value={formData.name}
              onChange={handleInputChange}
              readOnly={!isEditing} disabled={!isEditing}
            />
            <span className="input-group-text" id="basic-addon2">{formData.idUX}</span>
          </div>

          <label>Pháp Danh</label>
          <input
            id="phapdanh" name="phapdanh" className="form-control" type="text"
            value={formData.phapDanh}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          />

          <label>Email</label>
          <input
            id="email" name="email" className="form-control" type="email"
            value={formData.email}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          />

          <label>Đoàn</label>
          <input
            id="doan" name="doan" className="form-control" type="text"
            value={formData.tendoan}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          />

          <label>Chức Vụ</label>
          <CFormSelect
            name="roleId1"
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          >
            <option value={formData.idchucvu1} >
              {formData.tenchucvu1 || 'Chọn Chức Vụ'}
            </option>
            {roles.map((role) => (
              <option key={role.roleId} value={formData.roleId1?.roleName}>
                {role.roleName}
              </option>
            ))}
          </CFormSelect>

          <label>Ngày Sinh</label>
          <input
            id="ngaysinh" name="ngaysinh" className="form-control" type="date"
            value={formData.ngaysinh}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          />

          <label>Ngày Đăng Kí</label>
          <input
            id="registered" name="registered" className="form-control" type="date"
            value={formData.registered}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          />

          <label>Số Điện Thoại</label>
          <input
            id="phone" name="phone" className="form-control" type="text"
            value={formData.phone}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          />

          <label>Giới Tính</label>
          <div className="radio-group">
            <label className="radio-inline">
              <input type="radio" name="gender" value="Male"
                checked={formData.gender === "Male"}
                onChange={() => handleGenderChange(true)}
                disabled={!isEditing} />
              Nam
            </label>
            <label className="radio-inline">
              <input type="radio" name="gender" value="Female"
                checked={formData.gender === "Female"}
                onChange={() => handleGenderChange(false)}
                disabled={!isEditing} />
              Nữ
            </label>
          </div>

          <label>Bậc Học</label>
          <CFormSelect
            name="bacHoc"
            onChange={handleInputChange}
            readOnly={!isEditing}
            disabled={!isEditing}
          >
            <option value={formData.bacHocId} >
              {formData.tenBacHoc || 'Chọn Chức Vụ'}
            </option>
            {bacHoc.map((bac) => (
              <option key={bac.bacHocId} value={bac.bacHocId}>
                {bac.tenBacHoc}
              </option>
            ))}
          </CFormSelect>


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
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={isEditing} onChange={handleEditToggle} />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Chỉnh Sửa</label>
          </div>
          <div className="footer-buttons">
            <Button variant="success" disabled={!isEditing} onClick={handleSave}>
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

export default UserModal;
