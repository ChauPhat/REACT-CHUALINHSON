import React, { useState } from 'react'
import {
  CButton,
  CCol,
  CFormInput,
  CInputGroup,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';

const Notification = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isAllowed = true; // Điều kiện để hiển thị nút "Thêm"

  const notifications = [
    { id: 1, title: 'Thông báo 1', description: 'Chi tiết thông báo 1', date: '2024-08-28' },
    { id: 2, title: 'Thông báo 2', description: 'Chi tiết thông báo 2', date: '2024-08-27' },
    // Thêm thông báo khác nếu cần
  ];

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div>
        <h1>Thông Báo</h1>
      </div>

      <div>
        <div className="container-fluid">
          <CRow className="mb-3 d-flex">
            
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <CInputGroup>
                <CFormInput
                  placeholder="Tìm kiếm thông báo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Tiêu đề</CTableHeaderCell>
                <CTableHeaderCell>Mô tả</CTableHeaderCell>
                <CTableHeaderCell>Ngày</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredNotifications.map((notification, index) => (
                <CTableRow key={notification.id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{notification.title}</CTableDataCell>
                  <CTableDataCell>{notification.description}</CTableDataCell>
                  <CTableDataCell>{notification.date}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      </div>
    </>
  )
}

export default Notification;
