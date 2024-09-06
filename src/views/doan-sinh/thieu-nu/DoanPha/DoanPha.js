import React, { useState,useEffect } from 'react'
import {
  CAvatar,
  CTableDataCell,
  CRow,
  CFormInput,
  CButton,
  CCol,
} from '@coreui/react'


import Table from '../../../table/Table'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import UserModal from './UserModal';
import '../../../doan-sinh/DoanSinhCss/DanhSach.css'
import axios from 'axios'
import env from '../../../../env'




const handleGenderChange = (newGender) => {
  setUser(prevUser => ({
    ...prevUser,
    gender: newGender
  }));
};

const DPThieuNu = () => {
  const [searchName, setSearchName] = useState('')
  const [searchRegistered, setSearchRegistered] = useState('')
  const [searchRole, setSearchRole] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const layDuLieu = async () => {
      try {
        // First API call
        const response1 = await axios.get(`${env.apiUrl}/api/nhiemkydoans/getListNhiemKyDoanWithDoanId?doan_id=4`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        // Second API call
        const response2 = await axios.get(`${env.apiUrl}/api/doansinhdetails/getDoanSinhDetailsWithDoanId?doan_id=4`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

     
        // Mapping data from the first API response
        const data1 = response1.data.data.map(item => {
          const currentNhiemKy = item.nhiemKyDoans.find(nhiemKy => nhiemKy.isNow);
          return {
            id: item.userIdUx,
            name: item.hoTen,
            avatar: item.avatar,
            registered: item.createdDate,
            status: item.isActive ? 'Active' : 'Inactive',
            email: item.email,
            gender: item.gioiTinh,
            address: item.diaChi,
            phone: item.sdt,
            birthDate: item.ngaySinh,
            admissionDate: item.ngayGiaNhapDoan,
            group: item.doan ? item.doan.tenDoan : 'N/A',
            phapdanh: item.phapDanh,
            roleOfDoanTruong: currentNhiemKy ? currentNhiemKy.role : '',
          };
        });
        console.log(data1)
        // Mapping data from the second API response
        const data2 = response2.data.data.map(item => {
          // Adjust mapping logic according to the structure of the second API response
          const activeDoanSinhDetail = item.doanSinhDetails.find((detail) => detail.isActive) || item.doanSinhDetails[0];
          return {
            id: item.userIdUx,
            name: item.hoTen,
            avatar: item.avatar,
            registered: item.createdDate,
            status: item.isActive ? 'Active' : 'Inactive',
            email: item.email,
            gender: item.gioiTinh,
            address: item.diaChi,
            phone: item.sdt,
            birthDate: item.ngaySinh,
            admissionDate: item.ngayGiaNhapDoan,
            group: item.doan ? item.doan.tenDoan : 'N/A',
            phapdanh: item.phapDanh,
            roleOfDoanTruong: activeDoanSinhDetail ? activeDoanSinhDetail.role : '',
          };
        });
  
        // Combine both lists into a single array
        const combinedData = [...data1, ...data2];
  
        // Set the combined data to state
        setUsersData(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    layDuLieu();
  }, []);


  const filteredData = usersData.filter((user) => {
    return (
      (searchName === '' || user.name.toLowerCase().includes(searchName.toLowerCase())) &&
      (searchRole === '' || user.roleOfDoanTruong.toLowerCase().includes(searchRole.toLowerCase())) 
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
    <CTableDataCell width={'40%'} className="fixed-width-column">Pháp Danh || Tên</CTableDataCell>,
    <CTableDataCell width={'20%'} className="fixed-width-column">Vai trò </CTableDataCell>,
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
    <CFormInput className='fixed-width-input'
      type="search"
      placeholder="Tìm theo vai trò"
      value={searchRole}
      onChange={(e) => setSearchRole(e.target.value)}
    />,
    
    '',
  ];

  const renderRow = (user) => (
    <>
      <CTableDataCell>  
        <CAvatar src={` ${env.apiUrl}/api/file/get-img?userId=${user.id}&t=${Date.now()} `} />
      </CTableDataCell>
        <CTableDataCell>{user.name} || {user.name} </CTableDataCell>
        <CTableDataCell>{user.roleOfDoanTruong}</CTableDataCell>
      <CTableDataCell>
      <CButton color="info" variant="outline" onClick={() => handleShowModal(user)} 
       >Show</CButton>
      </CTableDataCell>
    </>
  );

  return (
    
    <div className="container-fluid">

    <br/>
      <CRow className="mb-3 d-flex">
        <CCol className="d-flex align-items-center flex-grow-1">
          <h3>Đoàn Phả Thiếu Nữ </h3>
        </CCol>
        <CCol className="d-flex justify-content-end">

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

export default DPThieuNu
