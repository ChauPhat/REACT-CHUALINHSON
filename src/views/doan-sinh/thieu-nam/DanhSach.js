import React, { useState, useEffect } from 'react';
import {
  CBadge,
  CAvatar,
  CTableDataCell,
  CRow,
  CFormInput,
  CButton,
  CCol,
} from '@coreui/react';
import axios from 'axios';
import '../DoanSinhCss/DanhSach.css';
import Table from '../../table/Table';
import UserModal from './modalDoanSinh/UserModal';

const DSNganhThanh = () => {
  const [searchName, setSearchName] = useState('');
  const [searchRegistered, setSearchRegistered] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    axios
      .get('http://103.15.222.65:8888/api/users/getListUserWithIDoan?doanId=3')
      .then((response) => {
        if (response.data.status === 'OK') {
          const fetchedData = response.data.data.map(item => ({
            id: item.user.userIdUx,
            name: item.user.hoTen,
            avatar: item.user.avatar,
            registered: item.user.createDate,
            phapDanh: item.user.phapDanh,
            ngaysinh: item.user.ngaySinh,
            phone: item.user.sdt,
            role: item.role,
            status: item.isActive ? 'Active' : 'Inactive',
            email: item.user.email,
            gender: item.user.gioiTinh,
            address: item.user.diaChi,
            sdtgd: item.user.sdtNguoiGiamHo,
            ngayGiaNhapDoan: item.joinDate,
            ngayRoiDoan: item.leftDate,
            mota: item.moTa,
            doan: item.doan.tenDoan,
          }));
          setUsersData(fetchedData);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-success';
      case 'Inactive':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const filteredData = usersData.filter((user) => {
    const nameMatch = user.name.toLowerCase().includes(searchName.toLowerCase());
    const registeredMatch = formatDateToDDMMYYYY(user.registered).includes(searchRegistered);
    const roleMatch = user.role.toLowerCase().includes(searchRole.toLowerCase());
    const statusMatch = user.status.toLowerCase().includes(searchStatus.toLowerCase());
    return nameMatch && registeredMatch && roleMatch && statusMatch;
  });

  const headers = [
    <CTableDataCell width={'5%'} className="fixed-width-column">Ảnh</CTableDataCell>,
    <CTableDataCell width={'25%'} className="fixed-width-column">Tên</CTableDataCell>,
    <CTableDataCell width={'25%'} className="fixed-width-column">Ngày đăng ký</CTableDataCell>,
    <CTableDataCell width={'20%'} className="fixed-width-column">Vai trò</CTableDataCell>,
    <CTableDataCell width={'15%'} className="fixed-width-column">Trạng thái</CTableDataCell>,
    <CTableDataCell width={'10%'} className="fixed-width-column">Thao tác</CTableDataCell>,
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
        <CAvatar src={`../../../../src/assets/images/avatars/`+user.avatar} />
      </CTableDataCell>
      <CTableDataCell>{user.name}</CTableDataCell>
      <CTableDataCell>{formatDateToDDMMYYYY(user.registered)}</CTableDataCell>
      <CTableDataCell>{user.role}</CTableDataCell>
      <CTableDataCell>
        <CBadge id='custom-badge' className={getBadgeClass(user.status)}>
          {user.status}
        </CBadge>
      </CTableDataCell>
      <CTableDataCell>
        <CButton color="info" variant="outline" onClick={() => handleShowModal(user)}>Show</CButton>
      </CTableDataCell>
    </>
  );

  return (
    <div className="container-fluid">
      <CRow className="mb-3 d-flex">
        <CCol className="d-flex align-items-center flex-grow-1">
          <h3>Danh sách Đoàn Sinh</h3>
        </CCol>
        <CCol className="d-flex justify-content-end">
          <CButton color="secondary">Thêm</CButton>
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
        />
      )}
    </div>
  );
};

export default DSNganhThanh;
