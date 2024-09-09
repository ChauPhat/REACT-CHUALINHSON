import React, { useState, useEffect } from 'react';
import {
  CTableDataCell,
  CRow,
  CFormInput,
  CButton,
  CCol,
} from '@coreui/react';
import Table from '../table/Table';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import GhiChuModal from './GhiChuModal';
import AddGhiChuModal from './AddGhiChuModal';
import '../doan-sinh/DoanSinhCss/DanhSach.css';
import axios from 'axios';
import env from '../../env';

const GhiChu = () => {
  const [searchName, setSearchName] = useState('');
  const [BacHocData, setBacHocData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBacHoc, setSelectedBacHoc] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  useEffect(() => {
    fetchData();
  }, []);
    
  const fetchData = async () => {
    try {
      const response = await axios.get(`${env.apiUrl}/api/bac-hoc/get-all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const fetchedData = response.data.data.map((item) => ({
        name: item.tenBacHoc,
        mota: item.moTa,

      }));

      setBacHocData(fetchedData);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  const filteredData = BacHocData.filter((bacHoc) => {
    return (
      (searchName === '' || (bacHoc.name && bacHoc.name.toLowerCase().includes(searchName.toLowerCase()))) 
    );
  });

  const handleShowModal = (bacHoc) => {
    setSelectedBacHoc(bacHoc);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBacHoc(null);
  };

  const onReloadTable = () => {
    fetchData(); // Reload the data table after editing
  };

  


  const headers = [

    <CTableDataCell width={'50%'} className="fixed-width-column">
      Tên Ghi Chú
    </CTableDataCell>,
    <CTableDataCell width={'60%'} className="fixed-width-column">
      Mô Tả
    </CTableDataCell>,
  ];
  
  const headerCells = [
    <CFormInput
      className="fixed-width-input"
      type="search"
      placeholder="Tìm theo tên"
      value={searchName}
      onChange={(e) => setSearchName(e.target.value)}
    />,
    '',
  ];

  const renderRow = (bacHoc) => (
    <>

      <CTableDataCell>{bacHoc.name}</CTableDataCell>
      <CTableDataCell>
        <CButton color="info" variant="outline" onClick={() => handleShowModal(bacHoc)}>
          Show
        </CButton>
      </CTableDataCell>
    </>
  );

  return (
    <div className="container-fluid">

      <CRow className="mb-3 d-flex">
        <CCol className="d-flex align-items-center flex-grow-1">
          <h3>Ghi Chú</h3>
        </CCol>
        <CCol className="d-flex justify-content-end">
          <CButton color="secondary" onClick={handleShowAddModal} >Thêm</CButton>
        </CCol>
      </CRow>

      <Table
        headers={headers}
        headerCells={headerCells}
        items={filteredData}
        renderRow={renderRow}
        searchCriteria={{ searchName }}
      />

        {selectedBacHoc && (
        <GhiChuModal show={showModal} handleClose={handleCloseModal} 
        bachoc={selectedBacHoc}  onReloadTable={onReloadTable}/>
        )}
        {showAddModal && (
          <AddGhiChuModal show={showAddModal} 
          handleClose={handleCloseAddModal}
        />
        )}
  

    </div>
  );
};

export default GhiChu;
