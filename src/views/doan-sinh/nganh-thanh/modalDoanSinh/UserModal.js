import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {
  CRow, CContainer,
  CCol, CFormSelect,
} from '@coreui/react'
import UserModal from './modalDoanSinh/UserModal';
import Swal from 'sweetalert2';
import apiClient from '../../../apiClient';

function UserModal({ show, handleClose, user, handleChangeDoanSinh }) {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [role1List, setRole1List] = useState([]);
  const [role2List, setRole2List] = useState([]);
  const [bacHocList, setBacHocList] = useState([]);
  const [capList, setCapList] = useState([]);
  const [traiHuanLuyenList, setTraiHuanLuyenList] = useState([]);
  const [formData, setFormData] = useState({
    ...user,
    latestTraiHuanLuyenId: user.lichSuTraiHuanLuyenDTOS.slice(-1)[0].traiHuanLuyenId,
    latestBacHocId: user.lichSuHocs.slice(-1)[0].bacHocId,
    latestCapId: user.lichSuCapDTOS.slice(-1)[0].capId,
    latestNgayKetThucTraiHuanLuyen: user.lichSuTraiHuanLuyenDTOS.slice(-1)[0].ngayKetThuc,
    latestNgayKetThucBacHoc: user.lichSuHocs.slice(-1)[0].ngayKetThuc,
    latestNgayKetThucCap: user.lichSuCapDTOS.slice(-1)[0].ngayKetThuc,

  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // Fetch roles as before
        const response = await apiClient.get(`/api/roles?isHuynhTruong=true`);
        const fetchedRoles = response.data.data;
        const role1List = fetchedRoles.filter((role) => role.doanId !== null);
        const role2List = fetchedRoles.filter((role) => role.doanId === null);

        setRole1List(role1List);
        setRole2List(role2List);
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

    const fetchCap = async () => {
      try {
        const response = await apiClient.get(`/api/cap`);
        setCapList(response.data.data);
      } catch (error) {
        console.error('Error fetching Bac Hoc:', error);
      }
    };

    const fetchTraiHuanLuyen = async () => {
      try {
        const response = await apiClient.get(`/api/trai-huan-luyen`);
        setTraiHuanLuyenList(response.data.data);
      } catch (error) {
        console.error('Error fetching Bac Hoc:', error);
      }
    };

    console.log(formData);


    fetchRoles();
    fetchBacHoc();
    fetchCap();
    fetchTraiHuanLuyen();
  }, []);


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
      gioiTinh: value === 'Male' ? true : false,
    });
  };

  const handleSave = async () => {
    console.log('Saving user:', formData);
    return;

    try {
      // Chuẩn bị dữ liệu cần gửi
      const updateData = {
        userId: formData.userId,
        userIdUx: formData.userIdUx,
        hoTen: formData.hoTen,
        ngaySinh: formData.ngaySinh,
        sdt: formData.sdt,
        email: formData.email,
        phapDanh: formData.phapDanh,
        gioiTinh: formData.gioiTinh,
        createdDate: formData.createdDate, // Giữ nguyên ngày tạo
        updatedDate: new Date().toISOString().split('T')[0], // Lấy ngày hiện tại
        diaChi: formData.diaChi, // Thêm sdtGd nếu cần
        avatar: selectedFile ? selectedFile.name : formData.avatar, // Lấy tên file ảnh
        isHuynhTruong: formData.isHuynhTruong,
        isActive: formData.isActive,
        roleId1: formData.role1 ? {
          roleId: formData.role1,
          userId: formData.userId,
        } : null,
        roleId2: formData.role2 ? { roleId: formData.role2 } : null,
        lichSuHocs: [
          ...formData.lichSuHocs,
          {
            bacHocId: formData.bacHoc,
            userId: formData.userId,
            ngayKetThuc: formData.ngayKetThucBacHoc,
          },
        ],
        lichSuCapDTOS: [
          ...formData.lichSuCapDTOS,
          {
            capId: formData.cap,
            userId: formData.userId,
            ngayKetThuc: formData.ngayKetThucCap,
          },
        ],
        lichSuTraiHuanLuyenDTOS: [
          ...formData.lichSuTraiHuanLuyenDTOS,
          {
            traiHuanLuyenId: formData.traiHuanLuyen,
            userId: formData.userId,
            ngayKetThuc: formData.ngayKetThucTraiHuanLuyen,
          },
        ],
        hoTenCha: formData.hoTenCha,
        hoTenMe: formData.hoTenMe,
        sdtCha: formData.sdtCha,
        sdtMe: formData.sdtMe,
        nhiemKyDoans: formData.nhiemKyDoans,
        doanSinhDetails: formData.doanSinhDetails,
      };

      // console.log('Update data:', updateData);
      // return; 
      const response = await apiClient.put(`/api/users/${updateData.userId}`, updateData,);

      if (response.status) {
        // Thông báo thành công
        Swal.fire({
          title: 'Thành công!',
          text: 'Cập nhật thông tin người dùng thành công!',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
        });
        handleChangeHuynhTruong();
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
            src={selectedFile ? URL.createObjectURL(selectedFile) : (formData.avatar || '')}
            alt="Avatar"
            className="bachoc-avatar"
          />
          {isEditing && (
            <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png" className="form-control mt-2" />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="hoTen">Họ Và Tên</label>
          <div className="input-group">
            <input
              id="hoTen" name="hoTen" className="form-control" type="text"
              value={formData.hoTen || ''} onChange={handleInputChange}
              readOnly={!isEditing} disabled={!isEditing} />
            <span className="input-group-text" id="basic-addon2">{formData.userIdUx || ''}</span>
          </div>

          <label htmlFor="roleId1">Chức Vụ</label>
          <CContainer className="px-1">
            <CRow>
              <CCol>
                <CFormSelect
                  name="roleId1"
                  aria-label="Chức Vụ 1"
                  value={formData.roleId1 ? formData.roleId1.roleId : ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="">Chọn chức vụ 1</option>
                  {role1List.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol>
                <CFormSelect
                  name="roleId2"
                  aria-label="Chức Vụ 2"
                  value={formData.roleId2 ? formData.roleId2.roleId : ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="">Chọn chức vụ 2</option>
                  {role2List.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          </CContainer>

          <label htmlFor="phapDanh">Pháp Danh</label>
          <input name="phapDanh" className="form-control" type="text"
            value={formData.phapDanh || ''} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing} />


          <label htmlFor="latestBacHocId">Bậc Học</label>
          <CFormSelect
            name="latestBacHocId"
            value={formData.latestBacHocId}
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

          <label htmlFor="latestNgayKetThucBacHoc">Ngày Kết Thúc Bậc Học</label>
          <input name="latestNgayKetThucBacHoc" className="form-control" type="date"
            value={formData.latestNgayKetThucBacHoc} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing} />

          <label htmlFor="latestCapId">Cấp</label>
          <CFormSelect
            name="latestCapId"
            value={formData.latestCapId}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <option value="">Chọn cấp</option>
            {capList.map((cap) => (
              <option key={cap.capId} value={cap.capId}>
                {cap.capName}
              </option>
            ))}
          </CFormSelect>

          <label htmlFor="latestNgayKetThucCap">Ngày Kết Thúc Cấp</label>
          <input name="latestNgayKetThucCap" className="form-control" type="date"
            value={formData.latestNgayKetThucCap} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing} />

          <label htmlFor="latestTraiHuanLuyenId">Trại Huấn Luyện</label>
          <CFormSelect
            name="latestTraiHuanLuyenId"
            value={formData.latestTraiHuanLuyenId}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <option value="">Chọn trại huấn luyện</option>
            {traiHuanLuyenList.map((trai) => (
              <option key={trai.traiHuanLuyenId} value={trai.traiHuanLuyenId}>
                {trai.tenTraiHuanLuyen}
              </option>
            ))}
          </CFormSelect>

          <label htmlFor="latestNgayKetThucTraiHuanLuyen">Ngày Kết Thúc Trại Huấn Luyện</label>
          <input name="latestNgayKetThucTraiHuanLuyen" className="form-control" type="date"
            value={formData.latestNgayKetThucTraiHuanLuyen} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing} />

          <label htmlFor="ngaySinh">Ngày Sinh</label>
          <input name="ngaySinh" className="form-control" type="date"
            value={formData.ngaySinh} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing} />


          <label htmlFor="createdDate">Ngày Gia Nhập</label>
          <input name="createdDate" className="form-control" type="date"
            value={formData.createdDate} onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing} />

          <label htmlFor="sdt">Số Điện Thoại</label>
          <input name="sdt" className="form-control" type="text" value={formData.sdt}
            onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing} />

          <label htmlFor="sdtCha">Số Điện Thoại Cha</label>
          <input name="sdtCha" className="form-control" type="text" value={formData.sdtCha || ""}
            onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing} />

          <label htmlFor="sdtMe">Số Điện Thoại Mẹ</label>
          <input name="sdtMe" className="form-control" type="text" value={formData.sdtMe || ""}
            onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing} />

          <label>Giới Tính</label>
          <div className="radio-group">
            <label className="radio-inline">
              <input type="radio" name="gioiTinh" value='Male'
                checked={formData.gioiTinh}
                onChange={() => handleGenderChange(true)}
                disabled={!isEditing} />
              Nam
            </label>
            <label className="radio-inline">
              <input type="radio" name="gioiTinh" value='Female'
                checked={!formData.gioiTinh}
                onChange={() => handleGenderChange(false)}
                disabled={!isEditing} />
              Nữ
            </label>
          </div>

          <label htmlFor="diaChi">Địa Chỉ</label>
          <textarea name="diaChi" className="form-control" id="exampleFormControlTextarea1" rows="3"
            value={formData.diaChi} onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing}
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
