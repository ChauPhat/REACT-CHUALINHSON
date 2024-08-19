import React, { useState } from 'react'
import {
  CBadge,
  CFormSelect,
  CAvatar,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CContainer,
  CRow,
  CPagination,
  CPaginationItem,
  CForm,
  CFormInput,
  CButton,
  CCol,
} from '@coreui/react'
import '../nganh-thanh/DanhSach.css'
import Table from '../../table/Table'

const usersData = [
  {
    id: 1,
    name: 'Samppa Nori',
    avatar: '1.jpg',
    registered: '02-11-2024',
    role: 'Member',
    status: 'Active',
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

const DSNganhThanh = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [searchName, setSearchName] = useState('')
  const [searchRegistered, setSearchRegistered] = useState('')
  const [searchRole, setSearchRole] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

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


  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value)
    setDropdownOpen(false) // Đóng dropdown sau khi chọn
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const headers = [
    'Ảnh',
    'Tên',
    'Ngày đăng ký',
    'Vai trò',
    'Trạng thái',
    'Thao tác',
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
      placeholder="Tìm theo ngày đăng ký (dd-mm-yyyy)"
      value={searchRegistered}
      onChange={(e) => setSearchRegistered(e.target.value)}
    />,
    <CFormInput
      type="search"
      placeholder="Tìm theo vai trò"
      value={searchRole}
      onChange={(e) => setSearchRole(e.target.value)}
    />,
    <CFormInput
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
        <CAvatar src={user.avatar} />
      </CTableDataCell>
      <CTableDataCell>{user.name}</CTableDataCell>
      <CTableDataCell>{user.registered}</CTableDataCell>
      <CTableDataCell>{user.role}</CTableDataCell>
      <CTableDataCell>
        <CBadge id='custom-badge' className={getBadgeClass(user.status)}>
          {user.status}
        </CBadge>
      </CTableDataCell>
      <CTableDataCell>
        <CButton color="info" variant="outline">Show</CButton>
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
        items={currentItems}
        renderRow={renderRow}
      />


      <div className='card-footer align-items-center'>
        <div className='row d-flex'>
          <div className='col-6 mb-3'>
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className="page-item">
                  <a
                    className="page-link"
                    href="#"
                    aria-label="Previous"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                {[...Array(totalPages).keys()].map(page => (
                  <li className={`page-item ${currentPage === page + 1 ? 'active' : ''}`} key={page}>
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {page + 1}
                    </a>
                  </li>
                ))}
                <li className="page-item">
                  <a
                    className="page-link"
                    href="#"
                    aria-label="Next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className='col-6 d-flex justify-content-end'>
            <span className='me-2 mt-1'>Dòng:</span>
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                onClick={toggleDropdown}
              >
                {itemsPerPage}
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu show">
                  <li>
                    <button className="dropdown-item" onClick={() => handleItemsPerPageChange(5)}>
                      5
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleItemsPerPageChange(10)}>
                      10
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleItemsPerPageChange(15)}>
                      15
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleItemsPerPageChange(20)}>
                      20
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DSNganhThanh
