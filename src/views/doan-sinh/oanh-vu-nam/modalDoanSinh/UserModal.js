import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../DoanSinhCss/UserModal.css';
import env from '../../../../env';
import apiClient from '../../../../apiClient';
import { CFormInput, CFormSelect } from '@coreui/react';
import Swal from 'sweetalert2';
import axios from 'axios';

function UserModal({ show, handleClose, user, handleChangeDoanSinh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ...user,
    roleId3: user.roleId1 ? user.roleId1 : "",
    bacHocIdU: user.lichSuHocs ? user.lichSuHocs.slice(-1)[0].bacHocId : '',
    ngayKetThucBacHocU: user.lichSuHocs ? user.lichSuHocs.slice(-1)[0].ngayKetThuc : '',
    traiHuanLuyenIdU: user.lichSuTraiHuanLuyenDTOS ? user.lichSuTraiHuanLuyenDTOS.slice(-1)[0].traiHuanLuyenId : '',
    ngayKetThucTraiHuanLuyenU: user.lichSuTraiHuanLuyenDTOS ? user.lichSuTraiHuanLuyenDTOS.slice(-1)[0].ngayKetThuc : '',
  });
  const [roles, setRoles] = useState([]);
  const [bacHoc, setBacHoc] = useState([]);
  const [trai, setTrai] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse, bacHocResponse, traiResponse] = await Promise.all([
          apiClient.get(`/api/roles/get-all`),
          apiClient.get(`/api/bac-hoc`),
          apiClient.get(`/api/trai-huan-luyen`)
        ]);

        if (rolesResponse.data.status === 'OK') {
          const filteredRoles = rolesResponse.data.data.filter(
            (role) => !role.isHuynhTruong && role.doanId === 1
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

        if (traiResponse.data.status === 'OK') {
          const filteredTrai = traiResponse.data.data.filter(
            (trai) => !trai.isHuynhTruong
          );
          setTrai(filteredTrai);
        } else {
          console.error('Lỗi khi lấy dữ liệu trại:', traiResponse.data.message);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(prevState => !prevState);
  };

  const handleGenderChange = (value) => {
    setFormData({
      ...formData,
      gioiTinh: value === 'Male' ? true : false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      setSelectedFile(file);
      setFormData(prevFormData => ({
        ...prevFormData,
        avatar: URL.createObjectURL(file),
      }));
    }
  };

  const handleSave = async () => {
    console.log('Saving user:', formData);
    try {
      const updateData = {
        userId: formData.userId,
        userIdUx: formData.userIdUx,
        hoTen: formData.hoTen,
        ngaySinh: formData.ngaySinh,
        sdt: formData.sdt,
        email: formData.email,
        phapDanh: formData.phapDanh,
        gioiTinh: formData.gioiTinh,
        createdDate: formData.createdDate,
        updatedDate: new Date().toISOString().split('T')[0],
        moTa: formData.moTa,
        diaChi: formData.diaChi,
        avatar: selectedFile ? selectedFile.name : formData.avatar,
        isHuynhTruong: formData.isHuynhTruong,
        isActive: formData.isActive,
        roleId1: formData.roleId3 ? {
          roleId: Number(formData.roleId3),
        } : null,

        lichSuHocs: [
          ...user.lichSuHocs,
          {
            bacHocId: formData.bacHocId,
            userId: formData.userId,
            ngayKetThuc: formData.ngayKetThucBacHoc,
          },
        ],
        lichSuTraiHuanLuyenDTOS: [
          ...user.lichSuTraiHuanLuyenDTOS,
          {
            traiHuanLuyenId: formData.traiHuanLuyenId,
            userId: formData.userId,
            ngayKetThuc: formData.ngayKetThucTrai,
          },
        ],
        hoTenCha: formData.hoTenCha,
        hoTenMe: formData.hoTenMe,
        sdtCha: formData.sdtCha,
        sdtMe: formData.sdtMe,
        nhiemKyDoans: formData.nhiemKyDoans,
        doanSinhDetails: formData.doanSinhDetails,
        // doanSinhDetails: [
        //   ...formData.doanSinhDetails,
        //   {
        //     isActive: formData.isActive,
        //     userId: formData.userId,
        //     joinDate: formData.joinDate,
        //     leftDate: formData.leftDate,
        //     updatedDate: formData.updatedDate,
        //     moTa: formData.moTa,
        //     tenDoan: formData.tenDoan,
        //     role: formData.role,
        //   },
        // ]

      };
      console.log(updateData);


      const response = await apiClient.put(`/api/users/${updateData.userId}`, updateData);
      if (response.status) {
        Swal.fire({
          title: 'Thành công!',
          text: 'Cập nhật thông tin người dùng thành công!',
          icon: 'success',
        });

        handleClose();
        handleChangeDoanSinh();
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
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
            src={selectedFile ? URL.createObjectURL(selectedFile) : (formData.avatar || '')}
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
              id="hoTen" name="hoTen" className="form-control" type="text"
              value={formData.hoTen}
              onChange={handleInputChange}
              readOnly={!isEditing} disabled={!isEditing}
            />
            <span className="input-group-text" id="basic-addon2">{formData.userIdUx}</span>
          </div>

          <label>Pháp Danh</label>
          <input
            id="phapDanh" name="phapDanh" className="form-control" type="text"
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
            id="tenDoan" name="tenDoan" className="form-control" type="text"
            value={formData.tenDoan}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          />

          <label>Chức Vụ</label>
          <CFormSelect
            name="roleId3"
            value={formData.roleId3}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          >
            <option value='' >
              Chọn Chức Vụ
            </option>
            {roles.map((role) => (
              <option key={role.roleId} value={role.roleId}>
                {role.roleName}
              </option>
            ))}
          </CFormSelect>

          <label>Ngày Sinh</label>
          <input
            id="ngaySinh" name="ngaySinh" className="form-control" type="date"
            value={formData.ngaySinh}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          />

          <label>Ngày Đăng Kí</label>
          <input
            id="createdDate" name="createdDate" className="form-control" type="date"
            value={formData.createdDate}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          />

          <label for="exampleFormControlInput1">Ngày Cập Nhật Đoàn</label>
          <input id="updatedDate" name="updatedDate" class="form-control" type="Date" value={formData.updatedDate}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing} />


          <label>Số Điện Thoại</label>
          <input
            id="sdt" name="sdt" className="form-control" type="text"
            value={formData.sdt}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          />

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

          <label htmlFor="bacHocId">Bậc Học</label>
          <CFormSelect
            name="bacHocIdU"
            value={formData.bacHocIdU}
            onChange={handleInputChange}
            readOnly={!isEditing}
            disabled={!isEditing}
          >
            <option value='' >
              'Chọn Chức Vụ'
            </option>
            {bacHoc.map((bac) => (
              <option key={bac.bacHocId} value={bac.bacHocId}>
                {bac.tenBacHoc}
              </option>
            ))}
          </CFormSelect>

          <label>Ngày Kết Thúc Bậc Học</label>
          <input id="ngayKetThucBacHocU" name="ngayKetThucBacHocU" value={formData.ngayKetThucBacHocU} className="form-control" type="date"
            onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing} />

          <label>Trại Huấn Luyện</label>
          <CFormSelect name="traiHuanLuyenIdU" value={formData.traiHuanLuyenIdU} onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing}>
            <option value='' >
              'Chọn Trại Huấn Luyện'
            </option>
            {trai.map(trai => (
              <option key={trai.traiHuanLuyenId} value={trai.traiHuanLuyenId}>
                {trai.tenTraiHuanLuyen}
              </option>
            ))}
          </CFormSelect>

          <label>Ngày Kết Thúc Trại</label>
          <input id="ngayKetThucTraiHuanLuyenU" name="ngayKetThucTraiHuanLuyenU" value={formData.ngayKetThucTraiHuanLuyenU} className="form-control" type="date" onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing} />


          <label for="exampleFormControlInput1">Địa Chỉ</label>
          <textarea id='address' name='address' class="form-control" rows="3" value={formData.address}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing}></textarea>

          <label>Họ Tên Cha</label>
          <input
            id="hoTenCha" name="hoTenCha" className="form-control" type="text"
            value={formData.hoTenCha}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          />

          <label>Số Điện Thoại Cha</label>
          <input
            id="sdtCha" name="sdtCha" className="form-control" type="text"
            value={formData.sdtCha}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          />

          <label>Họ Tên Mẹ</label>
          <input
            id="hoTenMe" name="hoTenMe" className="form-control" type="text"
            value={formData.hoTenMe}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          />

          <label>Số Điện Thoại Mẹ</label>
          <input
            id="sdtMe" name="sdtMe" className="form-control" type="text"
            value={formData.sdtMe}
            onChange={handleInputChange}
            readOnly={!isEditing} disabled={!isEditing}
          />

          <label for="exampleFormControlInput1">Ngày Gia Nhập Đoàn</label>
          <input id="joinDate" name="joinDate" class="form-control" type="Date" value={formData.joinDate}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing} />

          <label for="exampleFormControlInput1">Ngày Rời Đoàn</label>
          <input id="ngayRoiDoan" name="ngayRoiDoan" class="form-control" type="Date" value={formData.ngayRoiDoan}
            onChange={handleInputChange} readonly={!isEditing} disabled={!isEditing} />

          <label for="exampleFormControlInput1">Mô Tả</label>
          <textarea id='moTa' name='moTa' class="form-control" rows="3" value={formData.moTa}
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
