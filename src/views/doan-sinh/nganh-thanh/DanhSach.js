import React, { useState, useEffect } from 'react';
import {
  CBadge,
  CTableDataCell,
  CRow,
  CFormInput,
  CButton,
  CCol,
  CImage,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import axios from 'axios';
import '../DoanSinhCss/DanhSach.css';
import Table from '../../table/Table';
import UserModal from './modalDoanSinh/UserModal';
import env from '../../../env';
import Swal from 'sweetalert2';

const DSNganhThanh = () => {
  const [searchName, setSearchName] = useState('');
  const [searchRegistered, setSearchRegistered] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const layDuLieu = async () => {
      try {
        const response = await axios.get(`${env.apiUrl}/api/users/getListUserWithIDoan?doanId=1`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const fetchedData = await Promise.all(response.data.data.map(async (item) => {
          let imageUrl = '';
          try {
            const imageResponse = await axios.get(`${env.apiUrl}/api/file/get-img?userId=${item.userId}&t=${Date.now()}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              responseType: 'blob', // Đảm bảo nhận về dạng blob
            });
            imageUrl = URL.createObjectURL(imageResponse.data); // Tạo URL từ blob
          } catch (error) {
            console.error('Lỗi khi tải ảnh:', error);
          }
          return {
            id: item.userId,
            idUX: item.userIdUx,
            name: item.hoTen,
            avatar: imageUrl, // Lưu URL ảnh vào object người dùng
            registered: item.createdDate,
            phapDanh: item.phapDanh,
            ngaysinh: item.ngaySinh,
            phone: item.sdt,
            idchucvu1: item.roleId1.roleId,
            tenchucvu1: item.roleId1.roleName,
            chucvu2: item.roleId2?.roleName,
            status: item.isActive ? 'Active' : 'Inactive',
            email: item.email,
            gender: item.gioiTinh ? "Male" : "Female",
            address: item.diaChi,
            vaitro: item.role,
            sdtgd: item.sdtNguoiGiamHo,
            ngayGiaNhapDoan: item.joinDate,
            ngayRoiDoan: item.leftDate,
            mota: item.moTa,
            doan: item.tenDoan,
          };
        }));
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

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleGenderChange = (newGender) => {
    setUser(prevUser => ({
      ...prevUser,
      gender: newGender
    }));
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
    const nameMatch = (user.name || '').toLowerCase().includes(searchName.toLowerCase());
    const registeredMatch = formatDateToDDMMYYYY(user.registered).includes(searchRegistered);
    const roleMatch = (user.role || '').toLowerCase().includes(searchRole.toLowerCase());
    const statusMatch = (user.status || '').toLowerCase().includes(searchStatus.toLowerCase());
    return nameMatch && registeredMatch && roleMatch && statusMatch;
  });

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
  
    // Hiển thị hộp thoại xác nhận
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: `Bạn có muốn ${newStatus === 'Active' ? 'kích hoạt' : 'vô hiệu hóa'} người dùng này không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, thay đổi nó!',
      cancelButtonText: 'Hủy'
    });
  
    if (result.isConfirmed) {
      try {
        await axios.put(`${env.apiUrl}/api/users/activeUser`, null, {
          params: {
            userId: user.id,
            activeUser: newStatus === 'Active',
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        // Cập nhật trạng thái người dùng trong dữ liệu local state
        setUsersData(prevUsersData => 
          prevUsersData.map(u => 
            u.id === user.id ? { ...u, status: newStatus } : u
          )
        );
  
        // Hiển thị thông báo thành công
        Swal.fire(
          'Thành công!',
          `Trạng thái người dùng đã được cập nhật.`,
          'success'
        );
  
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
        // Hiển thị thông báo lỗi
        Swal.fire(
          'Thất bại!',
          'Đã xảy ra lỗi khi cập nhật trạng thái người dùng.',
          'error'
        );
      }
    }
  };
  

  const renderRow = (user) => (
    <>
      <CTableDataCell>
        <CImage
          src={user.avatar || '/path/to/default/avatar.png'} // Hiển thị avatar của người dùng, nếu không có thì dùng ảnh mặc định
          size="md" style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
        />
      </CTableDataCell>
      <CTableDataCell>
      <div>{user.name} || {user.phapDanh}</div>
      </CTableDataCell>
      <CTableDataCell>{user.tenchucvu1}</CTableDataCell>
      <CTableDataCell>{user.role}</CTableDataCell>
      <CTableDataCell>
        <CBadge id='custom-badge' className={getBadgeClass(user.status)}>
          {user.status}
        </CBadge>
      </CTableDataCell>
      <CTableDataCell>
        <CDropdown>
          <CDropdownToggle variant="outline" color="info">Xem</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem variant="outline" onClick={() => handleShowModal(user)}>
              <CButton>Thông tin</CButton>
            </CDropdownItem>
            <CDropdownItem
              onClick={() => handleToggleStatus(user)}
            >
              <CButton>{user.status === 'Active' ? 'Tắt Trạng Thái' : 'Bật Trạng Thái'}</CButton>
              
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </CTableDataCell>
    </>
  );

  const headers = [
    <CTableDataCell width={'5%'} className="fixed-width-column">Ảnh</CTableDataCell>,
    <CTableDataCell width={'25%'} className="fixed-width-column">Tên || Pháp Danh</CTableDataCell>,
    <CTableDataCell width={'25%'} className="fixed-width-column">Chức vụ</CTableDataCell>,
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

  return (
    <div className="container-fluid">
      <CRow className="mb-3 d-flex">
        <CCol className="d-flex align-items-center flex-grow-1">
          <h3>Danh sách Đoàn Sinh</h3>
        </CCol>
        <CCol className="d-flex justify-content-end">
          <CButton variant="outline" color="info">Thêm</CButton>
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
  );
};

export default DSNganhThanh;
