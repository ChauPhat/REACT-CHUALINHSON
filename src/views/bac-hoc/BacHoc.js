import React, { useState, useEffect } from 'react'
import {
    CBadge,
    CAvatar,
    CTableDataCell,
    CRow,
    CFormInput,
    CButton,
    CCol,
} from '@coreui/react'

import Table from '../table/Table'
import CategoryCarousel from "./CategoryCarousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BacHocModal from './BacHocModal';
import avatar1 from 'src/assets/images/avatars/1.jpg'

import '../doan-sinh/DoanSinhCss/DanhSach.css'
import axios from 'axios'
import env from '../../env'
const usersData = [
    {
        id: 'LS_000001',
        name: 'Samppa Nori',
        phapdanh: 'Active',
        avatar: avatar1,
        registered: '2024-02-11',
        role: 1,
        role2: 3,
        status: 'Active',
        phone: '0123456789',
        email: 'voanduy1802@gmail.com',
        userName: 'admin',
        password: '123123123',
        gender: 'male',
    },
    {
        id: 2,
        name: 'Estavan Lykos',
        avatar: '2.jpg',
        registered: '10-05-2023',
        role: 'Staff',
        status: 'Banned',
    }
]
// Hàm format date từ dd-mm-yyyy sang đối tượng Date


const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
}

const getBadgeClass = (status) => {
    switch (status) {
        case 'Active':
            return 'custom-badge-success';
        case 'Inactive':
            return 'custom-badge-danger';
    }
}

const handleGenderChange = (newGender) => {
    setUser(prevUser => ({
        ...prevUser,
        gender: newGender
    }));
};

const BacHoc = () => {
    const [searchName, setSearchName] = useState('')
    const [searchRegistered, setSearchRegistered] = useState('')
    const [searchRole, setSearchRole] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    //   const [usersData, setUsersData] = useState([]); fix đây

    const roleMapping = {
        'ROLE_DOANTRUONG': 'Đoàn Trưởng',
        'ROLE_THUKY': 'Thư Ký',
        'ROLE_THUQUY': 'Thủ Quỹ',
        'ROLE_ADMIN': 'Liên Đoàn Trưởng',
    };




    const formatDateToDDMMYYYY = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const filteredData = usersData.filter((user) => {
        return (
            (searchName === '' || user.name.toLowerCase().includes(searchName.toLowerCase())) &&
            (searchRegistered === '' || formatDateToDDMMYYYY(user.registered).includes(searchRegistered)) &&
            (searchRole === '' || user.role.toLowerCase().includes(searchRole.toLowerCase())) &&
            (searchStatus === '' || user.status.toLowerCase().includes(searchStatus.toLowerCase()))
        );
    });


    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleShowModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };



    const headers = [
        <CTableDataCell width={'20%'} className="fixed-width-column">Ảnh</CTableDataCell>,
        <CTableDataCell width={'20%'} className="fixed-width-column">Tên Bậc Học</CTableDataCell>,
        <CTableDataCell width={'20%'} className="fixed-width-column">Cấp Bật</CTableDataCell>,
        <CTableDataCell width={'20%'} className="fixed-width-column">Trạng thái</CTableDataCell>,
        <CTableDataCell width={'20%'} className="fixed-width-column">Thao tác</CTableDataCell>
    ];
    const headerCells = [
        '',
        <CFormInput className='fixed-width-input'
            type="search"
            placeholder="Tìm theo tên"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
        />,
        '',
        <CFormInput className='fixed-width-input'
        type="search"
        placeholder="Tìm theo trạng thái"
        value={searchStatus}
        onChange={(e) => setSearchStatus(e.target.value)}
        />,
        '',
    ];

    const renderRow = (user) => (
        <>
            <CTableDataCell>
                <CAvatar src={` ${env.apiUrl}/api/file/get-img?userId=${user.id}&t=${Date.now()} `} />
            </CTableDataCell>
            <CTableDataCell>{user.name}</CTableDataCell>
            <CTableDataCell>{user.roleOfDoanTruong}</CTableDataCell>
            <CTableDataCell>
                <CBadge id='custom-badge' className={getBadgeClass(user.status)}>
                    {user.status}
                </CBadge>
            </CTableDataCell>
            <CTableDataCell>
                <CButton color="info" variant="outline" onClick={() => handleShowModal(user)}
                >Show</CButton>
            </CTableDataCell>
        </>
    );

    return (

        <div className="container-fluid">
            <CategoryCarousel categories={usersData} />
            <br />
            <CRow className="mb-3 d-flex">
                <CCol className="d-flex align-items-center flex-grow-1">
                    <h3>Danh Sách Bậc Học</h3>
                </CCol>
                <CCol className="d-flex justify-content-end">
                    <CButton color="secondary" >Thêm</CButton>

                </CCol>
            </CRow>

            <Table
                headers={headers}
                headerCells={headerCells}
                items={filteredData}
                renderRow={renderRow}
                searchCriteria={{ searchName, searchRegistered, searchRole, searchStatus }}
            />


            {selectedUser && (
                <BacHocModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    user={selectedUser}
                    handleGenderChange={handleGenderChange}
                />
            )}



        </div>
    )
}

export default BacHoc
