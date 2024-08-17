import React, { useState } from 'react'
import {
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
  
  const usersData = [
    {
      id: 1,
      name: 'Samppa Nori',
      avatar: '1.jpg',
      registered: '2022/01/01',
      role: 'Member',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Estavan Lykos',
      avatar: '2.jpg',
      registered: '2022/02/07',
      role: 'Staff',
      status: 'Banned',
    },
    {
      id: 3,
      name: 'Chetan Mohamed',
      avatar: '3.jpg',
      registered: '2022/02/07',
      role: 'Admin',
      status: 'Inactive',
      _selected: true,
    },
    {
      id: 4,
      name: 'Derick Maximinus',
      avatar: '4.jpg',
      registered: '2022/03/19',
      role: 'Member',
      status: 'Pending',
    },
    {
      id: 5,
      name: 'Friderik Dávid',
      avatar: '5.jpg',
      registered: '2022/01/21',
      role: 'Staff',
      status: 'Active'
    },
    { 
      id: 6,
      name: 'Yiorgos Avraamu',
      avatar: '6.jpg',
      registered: '2022/01/01',
      role: 'Member',
      status: 'Active'
    },
    {
      id: 7,
      name: 'Avram Tarasios',
      avatar: '7.jpg',
      registered: '2022/02/07',
      role: 'Staff',
      status: 'Banned',
      _selected: true,
    },
    {
      id: 8,
      name: 'Quintin Ed',
      avatar: '8.jpg',
      registered: '2022/02/07',
      role: 'Admin',
      status: 'Inactive'
    },
    { 
      id: 9,
      name: 'Enéas Kwadwo',
      avatar: '9.jpg',
      registered: '2022/03/19',
      role: 'Member',
      status: 'Pending'
    },
    { 
      id: 10,
      name: 'Agapetus Tadeáš',
      avatar: '10.jpg',
      registered: '2022/01/21',
      role: 'Staff',
      status: 'Active'
    },
    { 
      id: 11,
      name: 'Carwyn Fachtna',
      avatar: '11.jpg',
      registered: '2022/01/01',
      role: 'Member',
      status: 'Active'
    },
    {
      id: 12,
      name: 'Nehemiah Tatius',
      avatar: '12.jpg',
      registered: '2022/02/07',
      role: 'Staff',
      status: 'Banned',
      _selected: true,
    },
    {
      id: 13,
      name: 'Ebbe Gemariah',
      avatar: '13.jpg',
      registered: '2022/02/07',
      role: 'Admin',
      status: 'Inactive'
    },
    {
      id: 14,
      name: 'Eustorgios Amulius',
      avatar: '14.jpg',
      registered: '2022/03/19',
      role: 'Member',
      status: 'Pending',
    },
    {
      id: 15,
      name: 'Leopold Gáspár',
      avatar: '15.jpg',
      registered: '2022/01/21',
      role: 'Staff',
      status: 'Active'
    },
  ]
  const getBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'success'
      case 'Inactive':
        return 'secondary'
case 'Pending':
        return 'warning'
      case 'Banned':
        return 'danger'
      default:
        return 'primary'
    }
  }
  
  const DSNganhThanh = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const [searchName, setSearchName] = useState('')
    const [searchRegistered, setSearchRegistered] = useState('')
    const [searchRole, setSearchRole] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
  
    const formatDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/');
      return new Date(year, month - 1, day);
    }
  
    const filteredData = usersData.filter((user) => {
        const userDate = new Date(user.registered); // Đảm bảo userDate là đối tượng Date
        const searchDate = searchRegistered ? new Date(searchRegistered) : null;
      
        return (
          user.name.toLowerCase().includes(searchName.toLowerCase()) &&
          (!searchDate || (
            userDate.getFullYear() === searchDate.getFullYear() &&
            userDate.getMonth() === searchDate.getMonth() &&
            userDate.getDate() >= searchDate.getDate()
          )) &&
          user.role.toLowerCase().includes(searchRole.toLowerCase()) &&
          user.status.toLowerCase().includes(searchStatus.toLowerCase())
        );
      });
      
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
  
    return (
      <div className="container-fluid">
        <CRow className="mb-3">
          <CCol md={6}>
            <h2>Danh sách Đoàn Sinh</h2>
          </CCol>
          <CCol md={6} className="d-flex justify-content-end">
            <CButton color="success">Thêm dữ liệu</CButton>
          </CCol>
        </CRow>
  
        <CTable hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Ảnh</CTableHeaderCell>
              <CTableHeaderCell scope="col">Tên</CTableHeaderCell>
              <CTableHeaderCell scope="col">Ngày đăng ký</CTableHeaderCell>
              <CTableHeaderCell scope="col">Vai trò</CTableHeaderCell>
              <CTableHeaderCell scope="col">Trạng thái</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {/* Dòng tìm kiếm */}
            <CTableRow>
              <CTableHeaderCell scope="row"></CTableHeaderCell>
              <CTableDataCell>
                <CFormInput
                  type="search"
                  placeholder="Tìm theo tên"
                  aria-label="Search by Name"
                  value={searchName}
onChange={(e) => setSearchName(e.target.value)}
                />
              </CTableDataCell>
              <CTableDataCell>
                <CFormInput
                  type="search"
                  placeholder="Tìm theo ngày đăng ký (dd/mm/yyyy)"
                  aria-label="Search by Registered Date"
                  value={searchRegistered}
                  onChange={(e) => setSearchRegistered(e.target.value)}
                />
              </CTableDataCell>
              <CTableDataCell>
                <CFormInput
                  type="search"
                  placeholder="Tìm theo vai trò"
                  aria-label="Search by Role"
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                />
              </CTableDataCell>
              <CTableDataCell>
                <CFormInput
                  type="search"
                  placeholder="Tìm theo trạng thái"
                  aria-label="Search by Status"
                  value={searchStatus}
                  onChange={(e) => setSearchStatus(e.target.value)}
                />
              </CTableDataCell>
              <CTableDataCell></CTableDataCell>
            </CTableRow>
  
            {/* Dữ liệu người dùng đã được lọc và phân trang */}
            {currentItems.length > 0 ? (
              currentItems.map((user, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="text-center">
                    <CAvatar src={`/images/${user.avatar}`} color="primary" textColor="white">
                      {user.name.charAt(0)}
                    </CAvatar>
                  </CTableDataCell>
                  <CTableDataCell>{user.name}</CTableDataCell>
                  <CTableDataCell>{user.registered}</CTableDataCell>
                  <CTableDataCell>{user.role}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color={getBadge(user.status)}>{user.status}</CButton>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="secondary" variant="outline">
                      Show
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="6" className="text-center">
                  Không tìm thấy dữ liệu
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
  
      {/* Điều hướng phân trang */}
      <CContainer>
        <CRow className="justify-content-between align-items-center">
          <CCol md={8}>
            <CPagination aria-label="Page navigation example">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
              >
                Previous
</CPaginationItem>
              {Array.from({ length: totalPages }, (_, index) => (
                <CPaginationItem
                  key={index}
                  active={index + 1 === currentPage}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
              >
                Next
              </CPaginationItem>
            </CPagination>
          </CCol>
          <CCol md={2} className="text-end">
            <CRow>
              <CCol md={6} className="text-end">
                Trang
              </CCol>
              <CCol md={6} className="text-end">
                <CFormSelect
                  size="sm"
                  aria-label="Default select example"
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  value={currentPage}
                >
                  {Array.from({ length: totalPages }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default DSNganhThanh