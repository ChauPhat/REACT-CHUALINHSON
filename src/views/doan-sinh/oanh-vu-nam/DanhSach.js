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
import InsertModal from './modalDoanSinh/InsertModal'
import UserModal from './modalDoanSinh/UserModal';
import ChuyenDoanModal from './modalDoanSinh/ChuyenDoanModal'
import env from '../../../env';
import Swal from 'sweetalert2';
import CategoryCarousel from "./modalDoanSinh/CategoryCarousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import apiClient from '../../../apiClient';

const DSOanhNam = () => {
  const [searchName, setSearchName] = useState('');
  const [searchChucVuMatch, setSearchChucVuMatch] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [searchIsActive, setSearchIsActive] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showChuyenDoan, setChuyenDoanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPUser, setSelectedPUser] = useState(null);
  const [pUsers, setPUsers] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [filename, setFilename] = useState('DanhSachOanhNam.xlsx');

  useEffect(() => {
    const layDuLieu = async () => {
      try {
        const response = await apiClient.get(`/api/doan-sinh-details?doanId=1`);
        setUsersData(response.data.data);
        

        const fetchedData = await Promise.all(response.data.data.map(async (item) => {
          const doanSinhDetails = item.doanSinhDetails || [];
          const lichSuHocs = item.lichSuHocs || [];
          const lichSuTraiHuanLuyenDTOS = item.lichSuTraiHuanLuyenDTOS || [];
          const roleId1 = item.roleId1 || {};

          // Lấy lịch sử học mới nhất
          const latestLichSuHoc = lichSuHocs.sort((a, b) => b.lichSuHocId - a.lichSuHocId)[0];

          const latestDoanSinhDetails = doanSinhDetails.sort((a, b) => b.doanSinhDetailId - a.doanSinhDetailId)[0];

          // Lấy trại huấn luyện mới nhất
          const latestTraiHuanLuyen = lichSuTraiHuanLuyenDTOS.sort((a, b) => b.lichSuTraiHuanLuyenId - a.lichSuTraiHuanLuyenId)[0];
  
            return {
              userId: item.userId,
              userIdUx: item.userIdUx,
              hoTen: item.hoTen,
              avatar: item.avatar,
              createdDate: item.createdDate,
              phapDanh: item.phapDanh,
              ngaySinh: item.ngaySinh,
              sdt: item.sdt,
              hoTenCha: item.hoTenCha,
              hoTenMe: item.hoTenMe,
              sdtCha: item.sdtCha,
              sdtMe: item.sdtMe,
              roleId: roleId1.roleId,
              isHuynhTruong: item.isHuynhTruong,
              roleName: roleId1.roleName,
              email: item.email,
              gioiTinh: item.gioiTinh ,
              diaChi: item.diaChi,
              role: latestDoanSinhDetails?.role,
              isActive: latestDoanSinhDetails?.isActive ? 'Active' : 'Inactive',
              doanSinhDetailId: latestDoanSinhDetails?.doanSinhDetailId,
              joinDate: latestDoanSinhDetails?.joinDate,
              leftDate: latestDoanSinhDetails?.leftDate,
              moTa: latestDoanSinhDetails?.moTa,
              tenDoan: latestDoanSinhDetails?.tenDoan,
              tenBacHoc: latestLichSuHoc?.tenBacHoc,
              bacHocId: latestLichSuHoc?.bacHocId,
              ngayKetThucBacHoc: latestLichSuHoc?.ngayKetThuc,
              tenTraiHuanLuyen: latestTraiHuanLuyen?.tenTraiHuanLuyen,
              traiHuanLuyenId: latestTraiHuanLuyen?.traiHuanLuyenId,
              ngayKetThucTrai: latestTraiHuanLuyen?.ngayKetThuc,
              nhiemKyDoans:item.nhiemKyDoans
            };
        }));
  
        setUsersData(fetchedData);
        
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        
      }
    };
  
    layDuLieu();
  }, []);

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Hàm để mở modal
  const handleOpenInsertModal = () => {
    setShowInsertModal(true);
  };

  // Hàm để đóng modal
  const handleCloseInsertModal = () => {
    setShowInsertModal(false);
  };

  // Hàm để mở modal
  const handleOpenChuyenDoanModal = (user) => {
    setSelectedUser(user);
    setChuyenDoanModal(true);
  };

  // Hàm để đóng modal
  const handleCloseChuyenDoanModal = () => {
    setShowModal(false);
    setChuyenDoanModal(null);
  };

  const getBadgeClass = (isActive) => {
    switch (isActive) {
      case 'Active':
        return 'bg-success';
      case 'Inactive':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const filteredData = usersData.filter((user) => {
    const nameMatch = (user.hoTen || '').toLowerCase().includes(searchName.toLowerCase());

    // Thêm điều kiện lọc cho cả hai trường chức vụ
    const chucVuMatch = (user.roleName || '').toLowerCase().includes(searchChucVuMatch.toLowerCase());

    const roleMatch = (user.role || '').toLowerCase().includes(searchRole.toLowerCase());
    // const isActiveMatch = (user.isActive || '').toLowerCase().includes(searchIsActive.toLowerCase());

    // return nameMatch && chucVuMatch && roleMatch && isActiveMatch;
    return nameMatch && chucVuMatch && roleMatch;
  });


  const handleToggleisActive = async (user) => {
    const newisActive = user.isActive !== 'Active';
  
    // Hiển thị hộp thoại xác nhận
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: `Bạn có muốn ${newisActive ? 'kích hoạt' : 'vô hiệu hóa'} người dùng này không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, thay đổi nó!',
      cancelButtonText: 'Hủy'
    });
  
    if (result.isConfirmed) {
      try {
        await apiClient.patch(`/api/doan-sinh-details/activate?doanSinhDetailId=${user.userId}&isActive=${newisActive}`);
        setUsersData(prevUsersData =>
          prevUsersData.map(u =>
            u.id === user.id ? { ...u, isActive: u.isActive === 'Active' ? 'Inactive' : 'Active' } : u
          )
        );
        Swal.fire(
          'Thành công!',
          `Trạng thái người dùng đã được cập nhật.`,
          'success'
        );
  
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
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
          src={user.avatar}
          size="md" style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
        />
      </CTableDataCell>
      <CTableDataCell>
        <div>{user.hoTen} || {user.phapDanh}</div>
      </CTableDataCell>
      <CTableDataCell>{user.roleName}</CTableDataCell>
      <CTableDataCell>{user.role}</CTableDataCell>
      <CTableDataCell>
        <CBadge id='custom-badge' className={getBadgeClass(user.isActive)}>
          {user.isActive }
        </CBadge>
      </CTableDataCell>
      <CTableDataCell>
        <CDropdown variant="btn-group" direction="center">
          <CDropdownToggle variant="outline" color="info">Xem</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem className='custom-dropdown-item' variant="outline" onClick={() => handleShowModal(user)}>
              Thông tin
            </CDropdownItem>
            <CDropdownItem className='custom-dropdown-item'
              onClick={() => handleToggleisActive(user)}>
              {user.isActive === 'Active' ? 'Tắt Trạng Thái' : 'Bật Trạng Thái'}
            </CDropdownItem>
            <CDropdownItem className='custom-dropdown-item' variant="outline" onClick={() => handleOpenChuyenDoanModal(pUsers.find(u => u.userId === user.id))}>
              Chuyển Đoàn
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </CTableDataCell>
    </>
  );

  const handleDownloadExtract = async () => {
    try {
      // Hiển thị Swal với trạng thái đang tải
      Swal.fire({
        title: 'Đang tạo file...',
        text: 'Vui lòng chờ trong giây lát.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Hiển thị icon loading
        },
      });

      // Gọi API với các tham số
      const response = await apiClient.get('api/export-excel/danh-sach-doan-sinh', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          filename: filename, 
          idDoan:'1'
        },
        responseType: 'arraybuffer',
      });
  
      // Tạo Blob từ dữ liệu phản hồi
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
  
      // Tạo phần tử liên kết để tải file
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Sử dụng tên tệp mà bạn muốn đặt
      document.body.appendChild(a); // Thêm liên kết vào body
  
      
      Swal.fire({
        icon: 'success',
        title: 'File đã sẵn sàng để tải xuống!',
        confirmButtonText: 'Tải xuống',
        allowOutsideClick: false, // Không cho phép nhấp ra ngoài để đóng Swal
        allowEscapeKey: false, // Không cho phép dùng phím Escape để thoát Swal
      }).then((result) => {
        if (result.isConfirmed) {
          // Tạo phần tử liên kết để tải file
          const a = document.createElement('a');
          a.href = url;
          a.download = filename; // Sử dụng tên tệp mà bạn muốn đặt
          document.body.appendChild(a); // Thêm liên kết vào body
          a.click(); // Nhấp vào liên kết để kích hoạt tải xuống
          document.body.removeChild(a); // Xóa liên kết khỏi body
          URL.revokeObjectURL(url); // Giải phóng URL đối tượng
        }
      });
    } catch (error) {
      console.error('Lỗi khi tải tệp:', error);
      // Cập nhật Swal khi có lỗi
      Swal.fire({
        icon: 'error',
        title: 'Tải tệp không thành công',
        text: 'Vui lòng thử lại.',
      });
    }
  };
  const headers = [
    <label width={'5%'} className="fixed-width-column d-block w-100 m-0">Ảnh</label>,
    <label width={'25%'} className="fixed-width-column d-block w-100 m-0">Tên || Pháp Danh</label>,
    <label width={'25%'} className="fixed-width-column d-block w-100 m-0">Chức vụ</label>,
    <label width={'20%'} className="fixed-width-column d-block w-100 m-0">Vai trò</label>,
    <label width={'15%'} className="fixed-width-column d-block w-100 m-0">Trạng thái</label>,
    <label width={'10%'} className="fixed-width-column d-block w-100 m-0">Thao tác</label>,
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
      placeholder="Tìm theo chức vụ"
      value={searchChucVuMatch}
      onChange={(e) => setSearchChucVuMatch(e.target.value)}
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
      value={searchIsActive}
      onChange={(e) => setSearchIsActive(e.target.value)}
    />,
    '',
  ];

  return (
    <div className="container-fluid">
      <CategoryCarousel categories={usersData} />
      <CRow className="mb-3 d-flex">
        <CCol className="d-flex align-items-center flex-grow-1">
          <h3>Danh sách Đoàn Sinh</h3>
        </CCol>
        <CCol className="d-flex justify-content-end">
          <CButton variant="outline" color="info" onClick={handleDownloadExtract} style={{marginRight:"5px"}}>Excel</CButton>
          <CButton variant="outline" color="info" onClick={handleOpenInsertModal}>Thêm</CButton>
        </CCol>
      </CRow>

      <Table
        headers={headers}
        headerCells={headerCells}
        items={filteredData}
        renderRow={renderRow}
        searchCriteria={{ searchName, searchChucVuMatch, searchRole, searchIsActive }}
      />

      {selectedUser && (
        <UserModal
          show={showModal}
          handleClose={handleCloseModal}
          user={selectedUser}
        />
      )}

      {showInsertModal && (
        <InsertModal
          show={showInsertModal}
          handleClose={handleCloseInsertModal}
      />
      )}
      {showChuyenDoan && (
        <ChuyenDoanModal
          show={showChuyenDoan}
          handleClose={handleCloseChuyenDoanModal}
          user={selectedUser}
      />
      )}
    </div>
  );
};

export default DSOanhNam;
