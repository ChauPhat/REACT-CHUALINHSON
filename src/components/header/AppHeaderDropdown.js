import React, { useState, useRef } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CFormInput
} from '@coreui/react'
import {
  cilLockLocked,
  cilUser
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import avatar8 from './../../assets/images/avatars/8.jpg'
import { jwtDecode } from 'jwt-decode'

const logOut = () => {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('tokenExpiry')
  sessionStorage.removeItem('user')
  window.location.href = '/login'
}

const AppHeaderDropdown = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png')
  const [userProfile, setUserProfile] = useState(null)
  const fileInputRef = useRef(null)

  const handleProfileClick = async () => {
    setModalVisible(true);

    try {
      const token = sessionStorage.getItem('token');
      
      // Giải mã token để lấy user_id
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;

      const response = await fetch(`http://103.15.222.65:8888/api/users/get_thong_tin_doan_sinh?user_id=${userId}`, {
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
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar src={avatar8} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Tài khoản</CDropdownHeader>
          <CDropdownItem href="#" onClick={handleProfileClick}>
            <CIcon icon={cilUser} className="me-2" />
            Hồ sơ của bạn
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem href="#" onClick={logOut}>
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
                  src={avatarUrl || userProfile.avatar}
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
          <CButton color="secondary" onClick={handleCloseModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AppHeaderDropdown
