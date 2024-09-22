import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../DoanSinhCss/UserModal.css';
import apiClient from '../../../../apiClient';
import { CFormInput, CFormSelect } from '@coreui/react';
import Swal from 'sweetalert2';

function ChuyenDoanModal({ show, handleClose, user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });
    const [roles, setRoles] = useState([]);
    // const [selectedFile, setSelectedFile] = useState(null);
    // const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rolesResponse = await apiClient.get(`/api/roles/get-all`);

                if (rolesResponse.data.status === 'OK') {
                    const filteredRoles = rolesResponse.data.data.filter(
                        (role) => !role.isHuynhTruong
                    );
                    setRoles(filteredRoles);
                } else {
                    console.error('Lỗi khi lấy dữ liệu roles:', rolesResponse.data.message);
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            roleId1: formData.roleId1 || null,
        }));
    }, [roles]);

    const handleEditToggle = () => {
        setIsEditing(prevState => !prevState);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: name === 'roleId1' ? parseInt(value) : value,
        });
    };
console.log(formData);

    const handleSave = async () => {
        try {
            const response = await apiClient.put(`/api/users/${formData.userId}`, formData);
            if (response.status) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Cập nhật thông tin người dùng thành công!',
                    icon: 'success',
                });
                handleClose();
            } else {
                console.error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <Modal scrollable show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="modal-title">Thông Tin Đoàn Sinh</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <label>Họ Và Tên</label>
                    <div className="input-group">
                        <input
                            id="name" name="name" className="form-control" type="text"
                            value={formData.hoTen}
                            readOnly
                        />
                        <span className="input-group-text" id="basic-addon2">{formData.userIdUx}</span>
                    </div>

                    <label>Chức Vụ</label>
                    <CFormSelect
                        name="roleId1"
                        onChange={handleInputChange}
                        readOnly={!isEditing} disabled={!isEditing}
                    >
                        <option value={formData.roleId1} >
                            {formData.roleName || 'Chọn Chức Vụ'}
                        </option>
                        {roles.map((role) => (
                            <option key={role.roleId} value={role.roleId}>
                                {role.roleName}
                            </option>
                        ))}
                    </CFormSelect>
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

export default ChuyenDoanModal;
