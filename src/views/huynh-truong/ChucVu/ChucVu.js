import React, { useState, useEffect } from 'react';
import {
  CBadge,
  CTableDataCell,
  CRow,
  CFormInput,
  CButton,
  CCol,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,

} from '@coreui/react';
import Table from '../../table/Table';
import CategoryCarousel from "../CategoryCarousel";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ChucVuModal from './ChucVuModal';
import AddChucVuModal from './AddChucVuModal';
import '../../doan-sinh/DoanSinhCss/DanhSach.css'
import axios from 'axios';
import env from '../../../env'

const ChucVu = () => {
  const [searchName, setSearchName] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [ChucVuData, setChucVuData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedChucVu, setSelectedChucVu] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);


  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${env.apiUrl}/api/role/get-all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const fetchedData = response.data.data.map((item) => ({
        id: item.roleId,
        name: item.roleName,
        role: item.isHuynhTruong ? 'Huynh Trưởng' : 'Đoàn Sinh',
        status: item.isActive ? 'Active' : 'Inactive',
      }));

      setChucVuData(fetchedData);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  const handleAddChucVu = (newChucVu) => {
    setChucVuData((prevData) => [...prevData, newChucVu]);
    fetchData();
  };

  const handleUpdateChucVu = (updatedChucVu) => {
    setChucVuData((prevData) =>
      prevData.map((item) => (item.id === updatedChucVu.id ? updatedChucVu : item))
    );
    fetchData();
  };

  const filteredData = ChucVuData.filter((ChucVu) => {
    return (
      (searchName === '' || (ChucVu.name && ChucVu.name.toLowerCase().includes(searchName.toLowerCase()))) &&
      (searchRole === '' || (ChucVu.role && ChucVu.role.toLowerCase().includes(searchRole.toLowerCase())))
    );
  });

  const handleShowModal = (ChucVu) => {
    setSelectedChucVu(ChucVu);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedChucVu(null);
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'custom-badge-success';
      case 'Inactive':
        return 'custom-badge-danger';
    }
  }


  const headers = [
    <CTableDataCell width={'40%'} className="fixed-width-column">
      Tên Chức Vụ
    </CTableDataCell>,
    <CTableDataCell width={'20%'} className="fixed-width-column">
      Cấp Bậc
    </CTableDataCell>,
    <CTableDataCell width={'20%'} className="fixed-width-column">
      Trạng Thái
    </CTableDataCell>,
    <CTableDataCell width={'20%'} className="fixed-width-column">
      Thao tác
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
    <CFormInput
      className="fixed-width-input"
      type="search"
      placeholder="Tìm theo cấp bậc"
      value={searchRole}
      onChange={(e) => setSearchRole(e.target.value)}
    />,
    '',
    '',
  ];

  const toggleStatus = async (ChucVu) => {
    try {
      // Gọi API để cập nhật trạng thái
      const newStatus = ChucVu.status === 'Active' ? 'Inactive' : 'Active';

      await axios.put(
        `${env.apiUrl}/api/role/${ChucVu.id}`,
        {
          roleName: ChucVu.name,
          isHuynhTruong: ChucVu.role === 'Huynh Trưởng',
          isActive: newStatus === 'Active'
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Cập nhật lại danh sách sau khi API thành công
      
      fetchData();
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const renderRow = (ChucVu) => (
    <>

      <CTableDataCell>{ChucVu.name}</CTableDataCell>
      <CTableDataCell>{ChucVu.role}</CTableDataCell>
      <CTableDataCell>
        <CBadge id='custom-badge' className={getBadgeClass(ChucVu.status)}>
          {ChucVu.status}
        </CBadge>
      </CTableDataCell>
      <CTableDataCell>
        <CDropdown>
          <CDropdownToggle variant="outline" color="info">Xem</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem variant="outline" onClick={() => handleShowModal(ChucVu)}>
              <CButton  >
                Thông tin
              </CButton>
            </CDropdownItem>
            <CDropdownItem onClick={() => toggleStatus(ChucVu)}>
              <CButton>{ChucVu.status === 'Active' ? 'Tắt Trạng Thái' : 'Bật Trạng Thái'}</CButton>
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </CTableDataCell>
    </>
  );

  return (
    <div className="container-fluid">
      {/* <CategoryCarousel categories={ChucVuData} /> */}
      <br />
      <CRow className="mb-3 d-flex">
        <CCol className="d-flex align-items-center flex-grow-1">
          <h3>Danh Sách Chức Vụ</h3>
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
        searchCriteria={{ searchName, searchRole }}
      />

      {selectedChucVu && (
        <ChucVuModal show={showModal} handleClose={handleCloseModal} ChucVu={selectedChucVu} onUpdateChucVu={handleUpdateChucVu} />
      )}

      {showAddModal && (
        <AddChucVuModal show={showAddModal}
          handleClose={handleCloseAddModal}
          onAddChucVu={handleAddChucVu} />
      )}

    </div>
  );
};

export default ChucVu;
