import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {
  CRow, CContainer,
  CCol, CFormSelect,
} from '@coreui/react'
import './UserModal.css';
import env from '../../../env'
import Swal from 'sweetalert2';
import axios from 'axios';
import apiClient from '../../../apiClient';

function UserModal({ show, handleClose, user, handleRoleChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [initialImageUrl, setInitialImageUrl] = useState('');
  const [rolesWithDoanId, setRolesWithDoanId] = useState([]);
  const [rolesWithoutDoanId, setRolesWithoutDoanId] = useState([]);
  const [bacHocList, setBacHocList] = useState([]);
  const [formData, setFormData] = useState({
    ...user,
    gender: user.gender ? 'Male' : 'Female',
    role1: user.role1 || '',
    role2: user.role2 || '',
    bacHoc: user.bacHoc || '',
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // Fetch roles as before
        const response = await apiClient.get(`/api/roles?isHuynhTruong=true`);
        const fetchedRoles = response.data.data;
        const rolesWithDoanId = fetchedRoles.filter((role) => role.doanId !== null);
        const rolesWithoutDoanId = fetchedRoles.filter((role) => role.doanId === null);

        setRolesWithDoanId(rolesWithDoanId);
        setRolesWithoutDoanId(rolesWithoutDoanId);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    // Fetch Bac Hoc
    const fetchBacHoc = async () => {
      try {
        const response = await apiClient.get(`/api/bac-hoc`);
        setBacHocList(response.data.data);
      } catch (error) {
        console.error('Error fetching Bac Hoc:', error);
      }
    };

    fetchRoles();
    fetchBacHoc();
  }, []);



  useEffect(() => {
    setFormData({
      ...user,
      gender: user.gender ? 'Male' : 'Female',
      role1: user.idrole1 || '',
      role2: user.idrole2 || '',
      bacHoc: user.bacHoc ? user.bacHoc.bacHocId : '',
    }
    );

  }, [user]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);

    const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];

    if (file && validExtensions.includes(file.type)) {
      setSelectedFile(file);
    } else {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Chỉ chấp nhận các file ảnh định dạng jpeg, jpg, png.',
        icon: 'error',
      });
      fileInputRef.current.value = ''; // Reset file input if invalid
    }

  };


  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenderChange = (value) => {
    setFormData({
      ...formData,
      gender: value ? "Male" : "Female",
    });
  };

  const handleSave = async () => {
    console.log('Saving user:', formData);

    try {
      // Chuẩn bị dữ liệu cần gửi
      const updateData = {
        userId: formData.id,
        userIdUx: formData.idUX,
        hoTen: formData.name,
        ngaySinh: formData.birthDate,
        sdt: formData.phone,
        email: formData.email,
        phapDanh: formData.phapdanh,
        gioiTinh: formData.gender === "Male",
        createdDate: user.createdDate, // Giữ nguyên ngày tạo
        updatedDate: new Date().toISOString().split('T')[0], // Lấy ngày hiện tại
        diaChi: formData.address,
        sdtGd: formData.phone || "", // Thêm sdtGd nếu cần
        avatar: selectedFile ? selectedFile.name : user.avatar, // Lấy tên file ảnh
        isHuynhTruong: formData.isHuynhTruong,
        isActive: formData.isActive,
        roleId1: formData.role1 ? { roleId: formData.role1 } : null,
        roleId2: formData.role2 ? { roleId: formData.role2 } : null,
        lichSuHocs: [
          {
            bacHocId: formData.bacHoc,
            userId: formData.id,
          },
        ],
        traiHuanLuyenId: formData.traiHuanLuyenId,
        hoTenCha: formData.hoTenCha,
        hoTenMe: formData.hoTenMe,
        nhiemKyDoans: formData.nhiemKyDoans,
        doanSinhDetails: formData.doanSinhDetails,
      };

      console.log('Update data:', updateData);
      // return; 
      const response = await apiClient.put(`/api/users/${updateData.userId}`, updateData,);

      if (response.status) {
        // Thông báo thành công
        Swal.fire({
          title: 'Thành công!',
          text: 'Cập nhật thông tin người dùng thành công!',
          icon: 'success',
        });
        handleClose(); // Đóng modal sau khi lưu thành công
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };


  return (
    <Modal show={show} scrollable onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Huynh Trưởng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="avatar-container">
          <img width={100}
            src={selectedFile ? URL.createObjectURL(selectedFile) : initialImageUrl}
            alt="Avatar"
            className="bachoc-avatar"
          />
          {isEditing && (
            <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png" className="form-control mt-2" />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="name">Họ Và Tên</label>
          <div className="input-group">
            <input
              id="name" name="name" className="form-control" type="text"
              value={formData.name} onChange={handleInputChange}
              readOnly={!isEditing} disabled={!isEditing} />
            <span className="input-group-text" id="basic-addon2">{user.idUX}</span>
          </div>

          <label htmlFor="role">Chức Vụ</label>
          <CContainer className="px-1">
            <CRow>
              <CCol>
                <CFormSelect
                  name="role1"
                  aria-label="Chức Vụ 1"
                  value={formData.role1}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="">Chọn chức vụ 1</option>
                  {rolesWithDoanId.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol>
                <CFormSelect
                  name="role2"
                  aria-label="Chức Vụ 2"
                  value={formData.role2}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="">Chọn chức vụ 2</option>
                  {rolesWithoutDoanId.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          </CContainer>



          <label htmlFor="phapdanh">Pháp Danh</label>
          <input name="phapdanh" className="form-control" type="text"
            value={formData.phapdanh} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing} />


          <label htmlFor="bacHoc">Bậc Học</label>
          <CFormSelect
            name="bacHoc"
            value={formData.bacHoc}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <option value="">Chọn bậc học</option>
            {bacHocList.map((bacHoc) => (
              <option key={bacHoc.bacHocId} value={bacHoc.bacHocId}>
                {bacHoc.tenBacHoc}
              </option>
            ))}
          </CFormSelect>

          <label htmlFor="email">Email</label>
          <input name="email" className="form-control" type="email"
            value={formData.email} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing} />

          <label htmlFor="registered">Ngày Sinh</label>
          <input name="registered" className="form-control" type="date"
            value={formData.birthDate} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing} />


          <label htmlFor="registered">Ngày Gia Nhập</label>
          <input name="registered" className="form-control" type="date"
            value={formData.registered} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing} />

          <label htmlFor="phone">Số Điện Thoại</label>
          <input name="phone" className="form-control" type="text" value={formData.phone}
            onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing} />

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

          <label htmlFor="address">Địa Chỉ</label>
          <textarea name="address" className="form-control" id="exampleFormControlTextarea1" rows="3"
            value={formData.address} onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="footer-container">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault"
              checked={isEditing} onChange={handleEditToggle} />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Chỉnh Sửa</label>
          </div>
          <div className="footer-buttons">
            <Button variant="success" disabled={!isEditing} onClick={handleSave} >
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
