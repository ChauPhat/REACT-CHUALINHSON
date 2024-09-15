import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import apiClient from '../../../../apiClient';
import { CFormInput, CFormSelect } from '@coreui/react';
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
    lichSuHocs: [{bacHocId:''}],
    traiHuanLuyenId: '',
    hoTenCha: '',
    hoTenMe: '',
    roleId1: { roleId: '' },
    roleId2: null
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse, bacHocResponse] = await Promise.all([
          apiClient.get(`/api/roles/get-all`),
          apiClient.get(`/api/bac-hoc`)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'gioiTinh' ? value === 'true' : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validExtensions.includes(file.type)) {
        Swal.fire({
          title: 'Thông báo từ hệ thống!',
          text: 'Đây không phải file ảnh, vui lòng chọn lại.',
          icon: 'warning',
        });
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl); // Cập nhật preview
      setSelectedFile(file); // Lưu file để upload khi nhấn Lưu
    }
  };

  const handleSave = async () => {
    const {
      hoTen, ngaySinh, sdt, email, roleId1,bacHocId, hoTenCha, hoTenMe, avatar, diaChi, sdtGd,
    } = formData;
  
    if (!hoTen || !ngaySinh || !sdt || !email || !roleId1 || !hoTenCha || !hoTenMe) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Các trường bắt buộc không được để trống!',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    const payload = {
      userId:formData.userId,
      hoTen: formData.hoTen,
      ngaySinh: formData.ngaySinh,
      sdt: formData.sdt,
      email: formData.email,
      phapDanh: formData.phapDanh,
      gioiTinh: formData.gioiTinh,
      createdDate: formData.createdDate,
      isHuynhTruong: formData.isHuynhTruong,
      updatedDate: formData.updatedDate,
      diaChi: formData.diaChi,
      sdtGd: formData.sdtGd,
      avatar: formData.avatar,
      isActive: formData.isActive,
      roleId1:  roleId1 ? { roleId: roleId1 } : null,
      roleId2: null,
      lichSuHocs: bacHocId ? [{ bacHocId: bacHocId }] : [],
      traiHuanLuyenId: formData.traiHuanLuyenId='1',
      hoTenCha: formData.hoTenCha,
      hoTenMe: formData.hoTenMe,
    };
  
    try {
      const response = await apiClient.post(`/api/users/create-user`, payload);
      console.log(response.data.data);
      if (selectedFile) {
        try {
          const fileFormData = new FormData();
          fileFormData.append('file', selectedFile);
          const userId = response.data.data.userId
          
          await apiClient.post(`/api/files/images/upload?userId=${userId}`, fileFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (fileUploadError) {
          console.error('Lỗi khi upload file:', fileUploadError);
          Swal.fire({
            title: 'Thông báo từ hệ thống!',
            text: 'Thêm Đoàn Sinh thất bại do lỗi upload file.',
            icon: 'error',
          });

          return;
        }
      }

      if (response.data) {
        Swal.fire({
          title: 'Thành công!',
          text: 'Đoàn sinh đã được thêm thành công!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          handleClose();
        });
      } else {
        Swal.fire({
          title: 'Lỗi!',
          text: `Lỗi khi thêm đoàn sinh: ${response.data.message}`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Lỗi hệ thống!',
        text: 'Có lỗi xảy ra khi gọi API.',
        icon: 'error',
        confirmButtonText: 'OK',
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
            src={avatarPreview || 'path/to/default/avatar.png'}
            alt="Avatar"
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
          <CFormSelect name="bacHocId" onChange={handleChange}>
            <option>Chọn Bậc Học</option>
            {bacHoc.map(bac => (
              <option key={bac.bacHocId} value={bac.bacHocId}>
                {bac.tenBacHoc}
              </option>
            ))}
          </CFormSelect>

          <label>Chức Vụ</label>
          <CFormSelect name="roleId1" onChange={handleChange}>
            <option>Chọn Chức Vụ</option>
            {roles.map(role => (
              <option key={role.roleId} value={role.roleId}>
                {role.roleName}
              </option>
            ))}
          </CFormSelect>

          <label>Họ Tên Cha</label>
          <input id="hoTenCha" name="hoTenCha" value={formData.hoTenCha} className="form-control" type="text" onChange={handleChange} />

          <label>Họ Tên Mẹ</label>
          <input id="hoTenMe" name="hoTenMe" value={formData.hoTenMe} className="form-control" type="text" onChange={handleChange} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSave}>
          Save
        </Button>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InsertModal;
