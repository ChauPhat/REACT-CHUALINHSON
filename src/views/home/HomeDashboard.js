import {
  CAvatar,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState, useRef } from 'react'

import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cilPeople,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import FiltersBarChart from "../charts/ChartBar"
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import axios from 'axios';
import apiClient from '../../apiClient'



const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/api/users', {
          params: { is_huynh_truong: false }
        });
        const users = response.data.data ; 
        setUsers(users);
        console.log(users);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchData();
  }, []);
  if (loading) {
    return <div>Loading...</div>; 
  }
  const tableExample = users.map(user => ({
    avatar: user.avatar,
    user: {
      name: `${user.phapDanh} || ${user.hoTen}`,
      new: true,  // Tuỳ bạn muốn xử lý thuộc tính này thế nào
      registered: user.createdDate,
    },
    role1: user.roleId1 ? user.roleId1.roleName : 'Chưa có', 
    role2: user.roleId2 ? user.roleId2.roleName : 'Chưa có',  
  }));


  return (
    <>
      <CRow xs={{ gutter: 3 }}>
        <CCol sm={6} md={8}>
          <CTable align="middle" hover responsive scrollable style={{ maxHeight: '400px',minHeight: '400px', overflowY: 'auto',display:'block' }}>
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary text-center">
                  <CIcon icon={cilPeople} />
                </CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Pháp Danh || Tên</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Vai Trò</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Vai Trò 2</CTableHeaderCell>
                {/* <CTableHeaderCell className="bg-body-tertiary">Trạng Thái</CTableHeaderCell> */}
              </CTableRow>
            </CTableHead>
            <CTableBody >
              {tableExample.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>
                    <img src={`${item.avatar}`} style={{ width:'35px', height:'35px', borderRadius:'50%' }} alt="Avatar" />
                  </CTableDataCell>
                  <CTableDataCell>{item.user.name}</CTableDataCell>
                  <CTableDataCell>{item.role1}</CTableDataCell>
                  <CTableDataCell>{item.role2}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCol>
        <CCol sm={6} md={4}>
          <WidgetsDropdown className="d-flex flex-column" />
        </CCol>
      </CRow>
      <br />
      <FiltersBarChart />
    </>
  )
}

export default Home
