import React, { useState } from 'react'
import {
  CBadge,
  CAvatar,
  CTableDataCell,
  CRow,
  CFormInput,
  CButton,
  CCol,
} from '@coreui/react'

import '../TaiKhoan/DanhSach.css'
import Table from '../../table/Table'
import CategoryCarousel from "../CategoryCarousel";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import UserModal from './UserModal';
import avatar1 from 'src/assets/images/avatars/1.jpg'

const usersData = [
  {
    id: 'LS_000001',
    name: 'Samppa Nori',
    phapdanh: 'Active',
    avatar: avatar1,
    registered: '2024-02-11',
    role: 'Đoàn Trưởng',
    role2: 'Thư Ký',
    status: 'Active', 
    phone: '0123456789',
    email: 'voanduy1802@gmail.com',
    userName: 'admin',
    password: '123123123'
  },
  {
    id: 2,
    name: 'Estavan Lykos',
    avatar: '2.jpg',
    registered: '10-05-2023',
    role: 'Staff',
    status: 'Banned',
  },
  {
    id: 3,
    name: 'Samppa Nori9',
    avatar: '1.jpg',
    registered: '20-08-2024',
    role: 'Member',
    status: 'Inactive',
  },
  {
    id: 4,
    name: 'Estavan Lykos4',
    avatar: '2.jpg',
    registered: '22-02-2024',
    role: 'Staff',
    status: 'Pending',
  },
  {
    id: 5,
    name: 'Nguyễn Văn A',
    avatar: '1.jpg',
    registered: '02-11-2024',
    role: 'Member',
    status: 'Active',
  },
  {
    id: 6,
    name: 'Trần Văn B',
    avatar: '2.jpg',
    registered: '10-05-2023',
    role: 'Staff',
    status: 'Banned',
  },
  {
    id: 7,
    name: 'Nguyễn Thị C',
    avatar: '1.jpg',
    registered: '20-08-2024',
    role: 'Member',
    status: 'Inactive',
  },
  {
    id: 8,
    name: 'Huỳnh Văn E',
    avatar: '2.jpg',
    registered: '22-02-2024',
    role: 'Staff',
    status: 'Pending',
  },
  {
    id: 9,
    name: 'Cao Văn L',
    avatar: '1.jpg',
    registered: '05-11-2004',
    role: 'Member',
    status: 'Active',
  },
  {
    id: 10,
    name: 'Phùng Châu P',
    avatar: '2.jpg',
    registered: '10-05-2003',
    role: 'Staff',
    status: 'Banned',
  },
  {
    id: 11,
    name: 'Hồ Thanh T',
    avatar: '1.jpg',
    registered: '20-08-2004',
    role: 'Member',
    status: 'Inactive',
  },
  {
    id: 12,
    name: 'Nguyễn Tấn L',
    avatar: '2.jpg',
    registered: '26-02-2005',
    role: 'Staff',
    status: 'Pending',
  },
  //... thêm dữ liệu khác
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
      return 'custom-badge-secondary';
    case 'Pending':
      return 'custom-badge-warning'
    case 'Banned':
      return 'custom-badge-danger';
    default:
      return 'primary'
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


  const filteredData = usersData.filter((user) => {
  const registeredDate = formatDate(user.registered);
  const searchDate = searchRegistered ? searchRegistered.split('-') : [];



    // Nếu chỉ nhập năm
    if (searchDate.length === 1 && searchDate[0].length === 4) {
      const searchYear = parseInt(searchDate[0], 10);
      return (
        (searchName === '' || user.name.toLowerCase().includes(searchName.toLowerCase())) &&
        (searchRole === '' || user.role.toLowerCase().includes(searchRole.toLowerCase())) &&
        (searchStatus === '' || user.status.toLowerCase().includes(searchStatus.toLowerCase())) &&
        registeredDate.getFullYear() === searchYear
      );
    }

    // Nếu nhập đầy đủ ngày-tháng-năm
    if (searchDate.length === 3) {
      const [searchDay, searchMonth, searchYear] = searchDate.map(Number);
      return (
        (searchName === '' || user.name.toLowerCase().includes(searchName.toLowerCase())) &&
        (searchRole === '' || user.role.toLowerCase().includes(searchRole.toLowerCase())) &&
        (searchStatus === '' || user.status.toLowerCase().includes(searchStatus.toLowerCase())) &&
        registeredDate.getDate() === searchDay &&
        registeredDate.getMonth() + 1 === searchMonth &&
        registeredDate.getFullYear() === searchYear
      );
    }

    // Mặc định trả về khi không nhập ngày đăng ký
    return (
      (searchName === '' || user.name.toLowerCase().includes(searchName.toLowerCase())) &&
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
    <CTableDataCell width={'10%'}>Ảnh</CTableDataCell>,
    <CTableDataCell width={'20%'}>Họ Và Tên</CTableDataCell>,
    <CTableDataCell width={'20%'}>Ngày Tạo</CTableDataCell>,
    <CTableDataCell width={'10%'}>Vai trò 1</CTableDataCell>,
    <CTableDataCell width={'10%'}>Vai trò 2</CTableDataCell>,
    <CTableDataCell width={'10%'}>Trạng thái</CTableDataCell>,
    <CTableDataCell width={'10%'}>Thao tác</CTableDataCell>
  ];
  const headerCells = [
    '',
    <CFormInput
      type="search"
      placeholder="Tìm theo tên"
      value={searchName}
      onChange={(e) => setSearchName(e.target.value)}
    />,
    <CFormInput
      type="search"
      placeholder="Ngày Đăng Ký (dd-mm-yyyy)"
      value={searchRegistered}
      onChange={(e) => setSearchRegistered(e.target.value)}
    />,
    '',
    '',
    '',
    '',
  ];

  const renderRow = (user) => (
    <>
      <CTableDataCell>
        <CAvatar src={user.avatar} />
      </CTableDataCell>
        <CTableDataCell>{user.name}</CTableDataCell>
        <CTableDataCell>{user.registered}</CTableDataCell>
        <CTableDataCell>{user.role}</CTableDataCell>
        <CTableDataCell>{user.role2}</CTableDataCell>
      <CTableDataCell>
        <CBadge id='custom-badge' className={getBadgeClass(user.status)}>
          {user.status}
        </CBadge>
      </CTableDataCell>
      <CTableDataCell>
        <CButton color="info" variant="outline" onClick={() => handleShowModal(user)} 
         disabled={user.status !== 'Active'}>Show</CButton>
      </CTableDataCell>
    </>
  );
    
 

  return (
    
    <div className="container-fluid">
    <CategoryCarousel categories={usersData} />
    <br/>
      <CRow className="mb-3 d-flex">
        <CCol className="d-flex align-items-center flex-grow-1">
          <h3>Danh sách Tài Khoản</h3>
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
                searchCriteria={{ searchName }} // truyền nhiều giá trị tìm kiếm vào Table nếu mày thích
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
