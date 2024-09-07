
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
import {
  cilLockLocked,
  cilUser,
  cilSettings
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { jwtDecode } from 'jwt-decode'
import Swal from "sweetalert2";
import env from '../../env';
import axios from 'axios';
import ChangePass from './ChangePassword'
import React, { useEffect, useRef, useState } from 'react'
import apiClient from '../../apiClient'
import { data } from 'autoprefixer';



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
  const [changePassModalVisible, setChangePassModalVisible] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found');
          return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        setIdUser(userId);
        const response = await apiClient.get('/api/file/get-img', {
          params: { userid: userId }
        });
        if (response.status === 200) {
          const newImageUrl = response.data.data;
          setImageUrl(newImageUrl);
        } else {
          console.error('Failed to fetch image URL, status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleProfileClick = async () => {
    setModalVisible(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;
      setIdUser(userId);
      const response = await apiClient.get(`/api/users/get_thong_tin_doan_sinh`, {
        params: { user_id: userId }
      });
      if (response.status === 200) {
        setUserProfile(response.data.data);
      } else {
        console.error('Failed to load profile, status:', response.status);
      }
    } catch (error) {
      console.error('Error occurred while fetching profile:', error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false)
  }

  const handleAvatarClick = () => {
    fileInputRef.current.click()
  }

  const handleChangePassClick = () => {
    setChangePassModalVisible(true); // Mở modal đổi mật khẩu
  }

  const handleCloseChangePassModal = () => {
    setChangePassModalVisible(false); // Đóng modal đổi mật khẩu
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
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Thêm Authorization header
          }
        })
        .then(() => {
          let timerInterval;
          return Swal.fire({
            title: "Thông báo từ hệ thống!",
            html: "Đang cập nhật hình ảnh<b></b>s",
            timer: 2500,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
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
          });
        })
        .then(async (result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            URL.revokeObjectURL(tempImageUrl);
            const token = localStorage.getItem('token');
            if (!token) {
              console.error('Token not found');
              return;
            }
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.user_id;
            setIdUser(userId);
            try {
              const response = await apiClient.get(`/api/file/get-img`, {
                params: { userid: userId },
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
              });
    
              if (response.status === 200) {
                const newImageUrl = response.data.data;
                setImageUrl(newImageUrl);
    
                await Swal.fire({
                  title: "Thông báo từ hệ thống!",
                  text: "Cập nhật ảnh thành công",
                  icon: "success"
                });
              } else {
                console.error('Failed to fetch new image URL, status:', response.status);
                await Swal.fire({
                  title: "Thông báo từ hệ thống!",
                  text: "Cập nhật ảnh không thành công.",
                  icon: "error"
                });
              }
            } catch (error) {
              console.error('Error fetching new image URL:', error);
              await Swal.fire({
                title: "Thông báo từ hệ thống!",
                text: "Đã xảy ra lỗi khi lấy ảnh.",
                icon: "error"
              });
            }
          }
        })
        .catch(error => {
          console.error('Error during image upload:', error);
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

    <>
      <ChangePass modalVisible={changePassModalVisible} onCloseModal={handleCloseChangePassModal} />

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
            <CDropdownItem href="#" onClick={handleChangePassClick}>
              <CIcon icon={cilSettings} className="me-2" />
              Đổi mật khẩu
            </CDropdownItem>
            <CDropdownDivider />
            <CDropdownItem href="#" onClick={logout}>
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
                    src={imageUrl || 'http://103.15.222.65/images/999.jpg'} alt="User Avatar"
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
                  value={userProfile[0].hoTen || "Nên đọc Chú Đại Bi"}
                  disabled
                  className="mb-3"
                />
                <CFormInput
                  type="text"
                  label="Pháp Danh"
                  value={userProfile[0].phapDanh || "Chưa cập nhật"}
                  disabled
                  className="mb-3"
                />
                <CFormInput
                  type="text"
                  label="Giới tính"
                  value={userProfile[0].gioiTinh ? "Nam" : "Nữ"}
                  disabled
                  className="mb-3"
                />
                <CFormInput
                  type="email"
                  label="Email"
                  value={userProfile[0].email || "Nên đọc Chú Đại Bi"}
                  disabled
                  className="mb-3"
                />
                <CFormInput
                  type="tel"
                  label="Số điện thoại"
                  value={userProfile[0].sdt || "Nên đọc Chú Đại Bi"}
                  disabled
                  className="mb-3"
                />
                <CFormInput
                  type="text"
                  label="Địa chỉ"
                  value={userProfile[0].diaChi || "Nên đọc Chú Đại Bi"}
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
    </>
  )

}

export default AppHeaderDropdown
