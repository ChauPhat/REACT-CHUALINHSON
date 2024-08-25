import React, { useState,useEffect } from 'react'
import {
  CBadge,
  CAvatar,
  CTableDataCell,
  CRow,
  CFormInput,
  CButton,
  CCol,
} from '@coreui/react'

import './DanhSach.css'
import Table from '../../table/Table'
import CategoryCarousel from "../CategoryCarousel";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import UserModal from './UserModal';
import avatar1 from 'src/assets/images/avatars/1.jpg'
import '../../doan-sinh/DoanSinhCss/DanhSach.css'
import axios from 'axios'
import env from '../../../env'




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

const DSNganhThanh = () => {
  const [searchName, setSearchName] = useState('')
  const [searchRegistered, setSearchRegistered] = useState('')
  const [searchRole, setSearchRole] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [usersData, setUsersData] = useState([]);

  const roleMapping = {
    'ROLE_DOANTRUONG': 'Đoàn Trưởng',
    'ROLE_THUKY': 'Thư Ký',
    'ROLE_THUQUY': 'Thủ Quỹ',
    'ROLE_ADMIN': 'Liên Đoàn Trưởng',
  };

  useEffect(() => {
    const layDuLieu = async () => {
      try {
        const response = await axios.get(`${env.apiUrl}/api/users/getListHuyTruong?is_huy_truonng=1`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          }
        });

          const fetchedData = response.data.data.map(item => {
          const roles = item.roles.split(',').map(role1 => roleMapping[role1.trim()] || role1);
          const [role1, role2] = roles.length > 1 ? roles : [roles[0], ''];
          const currentNhiemKy = item.nhiemKyDoans.find(nhiemKy => nhiemKy.isNow);
 
          return {
            id: item.userId,
            idUX: item.userIdUx,
            name: item.hoTen,
            avatar: item.avatar,
            registered: item.createDate,
            role1, 
            role2, 
            status: item.isActive ? 'Active' : 'Inactive',
            email: item.email,
            gender: item.gioiTinh ,
            address: item.diaChi,
            phone: item.sdt,
            birthDate: item.ngaySinh,
            admissionDate: item.ngayGiaNhapDoan, 
            group: item.doan ? item.doan.tenDoan : 'N/A', 
            phapdanh: item.phapDanh,
            roleOfDoanTruong: currentNhiemKy ? currentNhiemKy.role : '',
          };
        });

        setUsersData(fetchedData);
   
      } catch (error) {

        console.error('Lỗi khi gọi API:', error);
      }
    };
    layDuLieu();
  }, []);



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
    <CTableDataCell width={'10%'} className="fixed-width-column">Ảnh</CTableDataCell>,
    <CTableDataCell width={'20%'} className="fixed-width-column">Họ Và Tên</CTableDataCell>,
    <CTableDataCell width={'20%'} className="fixed-width-column">Ngày Tạo</CTableDataCell>,
    <CTableDataCell width={'10%'} className="fixed-width-column">Vai trò 1</CTableDataCell>,
    <CTableDataCell width={'10%'} className="fixed-width-column">Vai trò 2</CTableDataCell>,
    <CTableDataCell width={'20%'} className="fixed-width-column">Trạng thái</CTableDataCell>,
    <CTableDataCell width={'10%'} className="fixed-width-column">Thao tác</CTableDataCell>
  ];
  const headerCells = [
    '',
    <CFormInput className='fixed-width-input'
      type="search"
      placeholder="Tìm theo tên"
      value={searchName}
      onChange={(e) => setSearchName(e.target.value)}
    />,
    <CFormInput className='fixed-width-input'
      type="search"
      placeholder="Tìm theo ngày đăng ký (dd-mm-yyyy)"
      value={searchRegistered}
      onChange={(e) => setSearchRegistered(e.target.value)}
    />,
    <CFormInput className='fixed-width-input'
      type="search"
      placeholder="Tìm theo vai trò"
      value={searchRole}
      onChange={(e) => setSearchRole(e.target.value)}
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
        <CTableDataCell>{formatDateToDDMMYYYY(user.registered)}</CTableDataCell>
        <CTableDataCell>{user.roleOfDoanTruong}</CTableDataCell>
        <CTableDataCell>{user.role2}</CTableDataCell>
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
    <br/>
      <CRow className="mb-3 d-flex">
        <CCol className="d-flex align-items-center flex-grow-1">
          <h3>Danh sách Huynh Trưởng</h3>
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
        <UserModal
          show={showModal}
          handleClose={handleCloseModal}
          user={selectedUser}
          handleGenderChange={handleGenderChange}
        />
      )}


   
    </div>
  )
}

export default DSNganhThanh
