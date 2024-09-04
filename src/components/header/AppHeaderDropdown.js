import {
  cilLockLocked,
  cilUser
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle
} from '@coreui/react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useRef, useState } from 'react'
import Swal from "sweetalert2"
import apiClient from '../../apiClient'
import env from '../../env'


const logout = async () => {
  Swal.fire({
    icon: 'question',
    title: 'Bạn có muốn đăng xuất khỏi phần mềm?',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Đăng xuất',
    cancelButtonText: 'Hủy'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await apiClient.post(`/api/auth/logout`);
        Swal.fire({
          icon: 'success',
          title: 'Đăng xuất thành công!'
        }).then(() => {
          localStorage.clear();
          window.location.href = '/#login';
        });
      } catch (error) {
        console.error(error);
      }
    }
  })
}

const AppHeaderDropdown = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [iduser, setIdUser] = useState('');
  // const [iduserlog, setIdUserlog] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        setImageUrl(`${env.apiUrl}/api/file/get-img?userId=${userId}&t=${Date.now()}`)
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchData();
  }, []);


  const handleProfileClick = async () => {
    setModalVisible(true);

    try {
      const token = localStorage.getItem('token');
      // Giải mã token để lấy user_id
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;
      setIdUser(userId);

      const response = await fetch(`${env.apiUrl}/api/users/get_thong_tin_doan_sinh?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.data);
      } else {
        console.error('Failed to load profile');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleCloseModal = () => {
    setModalVisible(false)
  }

  const handleAvatarClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {

      const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];

      // Kiểm tra định dạng file
      if (!validExtensions.includes(file.type)) {
        Swal.fire({
          title: "Thông báo từ hệ thống!",
          text: "Đây không phải file ảnh, vui lòng chọn lai.",
          icon: "warning"
        });
        return; // Dừng nếu định dạng không hợp lệ
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const tempImageUrl = URL.createObjectURL(file); // Tạo URL tạm thời cho hình ảnh

        axios.post(`${env.apiUrl}/api/file/upload-img?userId=${iduser}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Thêm Authorization header
          }
        })
          .then(response => {
            let timerInterval;
            Swal.fire({
              title: "Thông báo từ hệ thống!",
              html: "Đang cập nhật hình ảnh<b></b>s",
              timer: 2500,
              timerProgressBar: true,
              allowOutsideClick: false, // Ngăn người dùng nhấn ra ngoài để tắt bảng
              allowEscapeKey: false, // Ngăn người dùng nhấn phím Escape để tắt bảng
              didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                  timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
              }
            }).then((result) => {
              /* Read more about handling dismissals below */
              if (result.dismiss === Swal.DismissReason.timer) {
                URL.revokeObjectURL(tempImageUrl); // Giải phóng URL tạm thời nếu cần
                const newImageUrl = `${env.apiUrl}/api/file/get-img?userId=${iduser}&t=${Date.now()}`;
                setImageUrl(newImageUrl);
                Swal.fire({
                  title: "Thông báo từ hệ thông!",
                  text: "Cập nhật ảnh thành công",
                  icon: "success"
                });
              }
            });
          })
          .catch(error => {
            Swal.fire({
              title: "Thông báo từ hệ thống!",
              text: "Cập nhật ảnh thất bại.",
              icon: "error"
            });
          });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }

  return (
    <div>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-1" caret={false}>
          <div class="avatar">
            <img class="avatar-img" src={`${imageUrl}`} style={{ width: '50px', height: '35px', borderRadius: '50%', cursor: 'pointer' }} />
          </div>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Tài khoản</CDropdownHeader>
          <CDropdownItem href="#" onClick={handleProfileClick}>
            <CIcon icon={cilUser} className="me-2" />
            Hồ sơ của bạn
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem onClick={logout}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Đăng xuất
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <CModal visible={modalVisible} onClose={handleCloseModal}>
        <CModalHeader>
          <CModalTitle>Hồ sơ người dùng</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {userProfile ? (
            <>
              <div className="text-center mb-3">
                <img
                  src={`${env.apiUrl}/api/file/get-img?userId=${iduser}&t=${Date.now()}`}
                  alt="User Avatar"
                  style={{ width: '100px', height: '100px', borderRadius: '50%', cursor: 'pointer' }}
                  onClick={handleAvatarClick}
                />
                <CFormInput
                  type="file"
                  className="mb-3"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png"
                />
              </div>
              <CFormInput
                type="text"
                label="Họ tên"
                value={userProfile.hoTen}
                disabled
                className="mb-3"
              />
              <CFormInput
                type="text"
                label="Pháp Danh"
                value={userProfile.phapDanh}
                disabled
                className="mb-3"
              />
              <CFormInput
                type="text"
                label="Giới tính"
                value={userProfile.gioiTinh ? "Nam" : "Nữ"}
                disabled
                className="mb-3"
              />
              <CFormInput
                type="email"
                label="Email"
                value={userProfile.email}
                disabled
                className="mb-3"
              />
              <CFormInput
                type="tel"
                label="Số điện thoại"
                value={userProfile.sdt}
                disabled
                className="mb-3"
              />
              <CFormInput
                type="text"
                label="Địa chỉ"
                value={userProfile.diaChi}
                disabled
                className="mb-3"
              />
            </>
          ) : (
            <p>Loading...</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="outline-secondary" onClick={handleCloseModal}>
            Đóng
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default AppHeaderDropdown
