import React, { useState } from 'react'
import {
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CButton,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CFormLabel
} from '@coreui/react'
import {
    cilLowVision,
    cilXCircle
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Swal from 'sweetalert2'

const ChangePass = ({ modalVisible, onCloseModal }) => {
    const [passwordType, setPasswordType] = useState('password');
    const [confirmPasswordType, setConfirmPasswordType] = useState('password');

    const togglePasswordVisibility = () => {
        setPasswordType((prevType) => prevType === 'password' ? 'text' : 'password');
    }

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordType((prevType) => prevType === 'password' ? 'text' : 'password');
    }

    const handleConfirmChange = () => {
        // Hiển thị thông báo đang chờ xét duyệt
        Swal.fire({
            title: "Thông báo từ hệ thống!",
            text: "Đang chờ được xét duyệt...",
            icon: "info",
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            timer: 3000, // Tự động tắt sau 3 giây
            timerProgressBar: true,
        }).then(() => {
            onCloseModal();  // Đóng modal đổi mật khẩu sau khi thông báo kết thúc
        });
    }

    return (
        <>
            <CModal alignment='center' visible={modalVisible} onClose={onCloseModal}>
                <CModalHeader>
                    <CModalTitle>Đổi mật khẩu</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="mb-3">
                        <CFormLabel htmlFor="newPassword">Mật khẩu mới</CFormLabel>
                        <CInputGroup>
                            <CFormInput
                                type={passwordType}
                                id="newPassword"
                                placeholder="Nhập mật khẩu mới"
                            />
                            <CInputGroupText onClick={togglePasswordVisibility}>
                                <CIcon icon={passwordType === 'password' ? cilLowVision : cilXCircle} />
                            </CInputGroupText>
                        </CInputGroup>
                    </div>

                    <div className="mb-3">
                        <CFormLabel htmlFor="confirmPassword">Xác nhận mật khẩu</CFormLabel>
                        <CInputGroup>
                            <CFormInput
                                type={confirmPasswordType}
                                id="confirmPassword"
                                placeholder="Xác nhận mật khẩu mới"
                            />
                            <CInputGroupText onClick={toggleConfirmPasswordVisibility}>
                                <CIcon icon={confirmPasswordType === 'password' ? cilLowVision : cilXCircle} />
                            </CInputGroupText>
                        </CInputGroup>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="outline-secondary" onClick={handleConfirmChange}>
                        Con muốn thay đổi chứ
                    </CButton>
                    <CButton color="outline-secondary" onClick={onCloseModal}>
                        Đóng
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default ChangePass
