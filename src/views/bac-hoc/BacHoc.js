  import React, { useState, useEffect } from 'react';
  import {
    CAvatar,
    CTableDataCell,
    CRow,
    CFormInput,
    CButton,
    CCol,
  } from '@coreui/react';
  import Table from '../table/Table';
  import CategoryCarousel from './CategoryCarousel';
  import 'slick-carousel/slick/slick.css';
  import 'slick-carousel/slick/slick-theme.css';
  import BacHocModal from './BacHocModal';
  import AddBacHocModal from './AddBacHocModal';
  import '../doan-sinh/DoanSinhCss/DanhSach.css';
  import axios from 'axios';
  import env from '../../env';

  const BacHoc = () => {
    const [searchName, setSearchName] = useState('');
    const [searchRole, setSearchRole] = useState('');
    const [BacHocData, setBacHocData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBacHoc, setSelectedBacHoc] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
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
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
  
        const fetchedData = response.data.data.map((item) => ({
          id: item.bacHocId,
          name: item.tenBacHoc,
          role: item.capBac,
          mota: item.moTa,
        }));
  
        setBacHocData(fetchedData);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    const handleAddBacHoc = (newBacHoc) => {
      setBacHocData((prevData) => [...prevData, newBacHoc]);
    };

    const filteredData = BacHocData.filter((bacHoc) => {
      return (
        (searchName === '' || (bacHoc.name && bacHoc.name.toLowerCase().includes(searchName.toLowerCase()))) &&
        (searchRole === '' || (bacHoc.role && bacHoc.role.toLowerCase().includes(searchRole.toLowerCase())))
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

    

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];

        if (!validExtensions.includes(file.type)) {
          Swal.fire({
            title: 'Thông báo từ hệ thống!',
            text: 'Đây không phải file ảnh, vui lòng chọn lại.',
            icon: 'warning',
          });
          return;
        }

        try {
          const formData = new FormData();
          formData.append('file', file);

          const tempImageUrl = URL.createObjectURL(file);

          axios
            .post(`${env.apiUrl}/api/file/upload-img?userId=${iduser}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              },
            })
            .then((response) => {
              let timerInterval;
              Swal.fire({
                title: 'Thông báo từ hệ thống!',
                html: 'Đang cập nhật hình ảnh<b></b>s',
                timer: 2500,
                timerProgressBar: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                  Swal.showLoading();
                  const timer = Swal.getPopup().querySelector('b');
                  timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                  }, 100);
                },
                willClose: () => {
                  clearInterval(timerInterval);
                },
              }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                  URL.revokeObjectURL(tempImageUrl);
                  const newImageUrl = `${env.apiUrl}/api/file/get-img?userId=${iduser}&t=${Date.now()}`;
                  setImageUrl(newImageUrl);
                  Swal.fire({
                    title: 'Thông báo từ hệ thống!',
                    text: 'Cập nhật ảnh thành công',
                    icon: 'success',
                  });
                }
              });
            })
            .catch((error) => {
              Swal.fire({
                title: 'Thông báo từ hệ thống!',
                text: 'Cập nhật ảnh thất bại.',
                icon: 'error',
              });
            });
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    };

    const headers = [
      <CTableDataCell width={'20%'} className="fixed-width-column">
        Ảnh
      </CTableDataCell>,
      <CTableDataCell width={'40%'} className="fixed-width-column">
        Tên Bậc Học
      </CTableDataCell>,
      <CTableDataCell width={'20%'} className="fixed-width-column">
        Cấp Bật
      </CTableDataCell>,
      <CTableDataCell width={'20%'} className="fixed-width-column">
        Thao tác
      </CTableDataCell>,
    ];
    
    const headerCells = [
      '',
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
    ];

    const renderRow = (bacHoc) => (
      <>
        <CTableDataCell>
          <CAvatar
            src={`${imageUrl}`}
            style={{ width: '50px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png"
            onError={(e) => {
              e.target.onerror = null;
            }
          }
          />
        </CTableDataCell>
        <CTableDataCell>{bacHoc.name}</CTableDataCell>
        <CTableDataCell>{bacHoc.role}</CTableDataCell>
        <CTableDataCell>
          <CButton color="info" variant="outline" onClick={() => handleShowModal(bacHoc)}>
            Show
          </CButton>
        </CTableDataCell>
      </>
    );

    return (
      <div className="container-fluid">
        <CategoryCarousel categories={BacHocData} />
        <br />
        <CRow className="mb-3 d-flex">
          <CCol className="d-flex align-items-center flex-grow-1">
            <h3>Danh Sách Bậc Học</h3>
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

        {selectedBacHoc && (
          <BacHocModal show={showModal} handleClose={handleCloseModal} bachoc={selectedBacHoc} />
        )}

        {showAddModal && (
          <AddBacHocModal show={showAddModal} 
          handleClose={handleCloseAddModal}
          onAddBacHoc={handleAddBacHoc} />
        )}

      </div>
    );
  };

  export default BacHoc;
