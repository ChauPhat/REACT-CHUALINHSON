import React, { useState } from 'react'
import {
  CAvatar,
  CBadge,
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
  CFormInput,
  CFormCheck
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
  window.location.href = '/login'
}

const AppHeaderDropdown = () => {
  const [modalVisible, setModalVisible] = useState(false)

  const handleProfileClick = () => {
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
  }

  const user = {
    name: 'Nguyễn Văn A',
    phapdanh: 'Pháp Danh',
    gender: 'Nam',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    chucvu: '123 Đường ABC, Quận 1, TP. HCM'
  }

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar src={avatar8} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
          <CDropdownItem href="#" onClick={handleProfileClick}>
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem href="#" onClick={logOut}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Log Out
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <CModal
        visible={modalVisible}
        onClose={handleCloseModal}
      >
        <CModalHeader>
          <CModalTitle>User Profile</CModalTitle>
        </CModalHeader>
        <CModalBody>
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
          <CFormCheck type="radio" name="exampleRadios" id="exampleRadios1" value="option1" label="Default radio" defaultChecked />
          <CFormCheck type="radio" name="exampleRadios" id="exampleRadios2" value="option2" label="Second default radio" />
          <CFormCheck type="radio" name="exampleRadios" id="exampleRadios3" value="option3" label="Disabled radio" disabled />
          <CFormCheck type="radio" name="exampleRadios" id="exampleRadios1" value="option1" label="Default radio" defaultChecked />
          <CFormCheck type="radio" name="exampleRadios" id="exampleRadios2" value="option2" label="Second default radio" />
          <CFormCheck type="radio" name="exampleRadios" id="exampleRadios3" value="option3" label="Disabled radio" disabled />
          <CFormInput
            type="text"
            label="Chúc vụ"
            value={user.chucvu}
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