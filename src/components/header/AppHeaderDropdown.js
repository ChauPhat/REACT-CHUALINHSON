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

const logOut = () => {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('tokenExpiry')
  sessionStorage.removeItem('user')
  window.location.href = '/login'
}

const AppHeaderDropdown = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png')
  const fileInputRef = useRef(null)

  const handleProfileClick = () => {
    setModalVisible(true)
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

  const user = {
    name: 'Nguyễn Văn A',
    phapdanh: 'Pháp Danh',
    gender: 'Nam',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    diachi: '123 Đường ABC, Quận 1, TP. HCM'
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

      <CModal
        visible={modalVisible}
        onClose={handleCloseModal}
      >
        <CModalHeader>
          <CModalTitle>Hồ sơ người dùng</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="text-center mb-3">
            <img
              src={avatarUrl}
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
            value={user.name}
            disabled
            className="mb-3"
          />
          <CFormInput
            type="text"
            label="Pháp Danh"
            value={user.phapdanh}
            disabled
            className="mb-3"
          />
          <CFormInput
            type="text"
            label="Giới tính"
            value={user.gender}
            disabled
            className="mb-3"
          />
          <CFormInput
            type="email"
            label="Email"
            value={user.email}
            disabled
            className="mb-3"
          />
          <CFormInput
            type="tel"
            label="Số điện thoại"
            value={user.phone}
            disabled
            className="mb-3"
          />
          <CFormInput
            type="text"
            label="Địa chỉ"
            value={user.diachi}
            disabled
            className="mb-3"
          />
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
