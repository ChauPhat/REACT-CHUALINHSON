import {
    CButton,
    CCol,
    CFormInput,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CTableDataCell,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CFormSelect,
} from '@coreui/react';
import React, { useState, useEffect } from 'react';
import Table from '../table/Table';
import WidgetsBrand from './WidgetsBrand';
import axios from 'axios'
import env from '../../env'
import '../doan-sinh/DoanSinhCss/DanhSach.css'

const QuyGD = () => {
    const [searchName, setSearchName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [fundData, setFundData] = useState([]);
    const [fundData2, setFundData2] = useState([]);
    const [newFund, setNewFund] = useState({
        tenThuChi: '',
        moTa: '',
        thuHoacChi: false,
        soTien: 0,
    })
    const [selectedMoTa, setSelectedMoTa] = useState('');
    const [years, setYears] = useState([]); // State để lưu danh sách năm
    const [selectedYear, setSelectedYear] = useState(''); // State để lưu năm được chọn
    const [selectedQuarter, setSelectedQuarter] = useState('1'); // State để lưu quý được chọn

    useEffect(() => {
        const fetchFundData = async () => {
            try {
                const response = await axios.get(`${env.apiUrl}/api/quygiadinh/getListLichQuyGiaDinh`
                );
                const apiData = response.data.data;

                console.log(apiData);


                const formattedData = apiData.flatMap((fund) =>
                    fund.lichSuQuyGiaDinhs.map((item) => ({
                        tenThuChi: item.tenThuChi || 'Chưa có tên quỹ',
                        moTa: item.moTa || 'Không có mô tả',
                        soTien: item.soTien || 0,
                        thuHoacChi: item.thuOrChi,
                    }))
                );

                  // Lấy danh sách năm từ API
                  const uniqueYears = [...new Set(apiData.flatMap((fund) =>
                    fund.lichSuQuyGiaDinhs.map((item) => item.year)
                ))];

                //truyền giá trị qua widgetBrand
                let totalAmount = 0;
                let totalIncome = 0;
                let totalExpense = 0;

                apiData.forEach(fund => {
                    fund.lichSuQuyGiaDinhs.forEach(item => {
                        const amount = item.soTien || 0;
                        totalAmount += amount;

                        if (item.thuOrChi) {
                            totalIncome += amount;
                        } else {
                            totalExpense += amount;
                        }
                    });
                });

                setFundData(formattedData);
                setFundData2({ totalAmount, totalIncome, totalExpense });
                setYears(uniqueYears); 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchFundData();
    }, []);

    const filteredData = fundData.filter((fund) =>
        searchName === '' || fund.tenThuChi.toLowerCase().includes(searchName.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFund(prev => ({
            ...prev,
            [name]: value,
        }));
    };



    const headers = [
        <CTableDataCell width={'30%'} className="fixed-width-column">Tên Thu Chi</CTableDataCell>,
        <CTableDataCell width={'30%'} className="fixed-width-column">Số tiền</CTableDataCell>,
        <CTableDataCell width={'40%'} className="fixed-width-column">Mô tả</CTableDataCell>
    ];

    const headerCells = [
        <CFormInput className='fixed-width-input'
            type="search"
            placeholder="Tìm theo tên"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
        />,
        '',
        '',
    ];

    const renderRow = (fund) => (
        <>
            <CTableDataCell>{fund.tenThuChi}</CTableDataCell>
            <CTableDataCell

            >
                <label style={{ color: fund.thuHoacChi ? 'green' : 'red' }}> {(fund.thuHoacChi) ? '+' : '-'}{fund.soTien}</label>  <label className=""> VNĐ</label>
            </CTableDataCell>
            <CTableDataCell>
                <CDropdown>
                    <CDropdownToggle variant="outline" color="info">Xem</CDropdownToggle>
                    <CDropdownMenu >
                        <CDropdownItem onClick={() => {
                            setSelectedMoTa(fund.moTa);
                            setModalVisible2(true);
                        }}>Xem mô tả</CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
            </CTableDataCell>
        </>
    );


    return (
        <div className="container-fluid">
            <WidgetsBrand
                totalAmount={fundData2.totalAmount}
                totalIncome={fundData2.totalIncome}
                totalExpense={fundData2.totalExpense}
            />

            <CRow className="my-3 d-flex">
                <CCol className="d-flex align-items-center flex-grow-1">
                    <h3>Quỹ Gia Đình</h3>
                </CCol>
                <CCol className="d-flex justify-content-end">
                    <CFormSelect
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="me-2"
                    >
                        <option value="">Chọn năm</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </CFormSelect>
                    <CFormSelect className='me-2'
                        value={selectedQuarter}
                        onChange={(e) => setSelectedQuarter(e.target.value)}
                    >
                        <option value="1">Quý 1</option>
                        <option value="2">Quý 2</option>
                        <option value="3">Quý 3</option>
                        <option value="4">Quý 4</option>
                    </CFormSelect>
                    <CButton color="secondary" onClick={() => setModalVisible(true)}>
                        Thêm
                    </CButton>
                </CCol>
            </CRow>

            <Table
                headers={headers}
                headerCells={headerCells}
                items={filteredData}
                renderRow={renderRow}
                searchCriteria={{ searchName }}
            />

            {/* Modal hiển thị mô tả */}
            <CModal visible={modalVisible2} alignment="center" onClose={() => setModalVisible2(false)}>
                <CModalHeader>
                    <CModalTitle>Mô tả</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedMoTa.split('-').map((line, index) => {
                        if (index === 0) {
                            return <span key={index}>{line.trim()}</span>;
                        }
                        return (
                            <div key={index}>
                                - {line.trim()}
                            </div>
                        );
                    })}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalVisible2(false)}>
                        Đóng
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal thêm quỹ mới */}
            <CModal visible={modalVisible} alignment="center" onClose={() => setModalVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Thêm Quỹ Mới</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Tên Thu Chi"
                        name="transactionName"
                        value={newFund.transactionName}
                        onChange={handleInputChange}
                        className="mb-3"
                    />
                    <CFormInput
                        label="Số tiền"
                        name="amount"
                        value={newFund.amount}
                        type="number"
                        onChange={handleInputChange}
                        className="mb-3"
                    />
                    <CFormInput
                        label="Mô tả"
                        name="description"
                        value={newFund.description}
                        onChange={handleInputChange}
                        className="mb-3"
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalVisible(false)}>
                        Đóng
                    </CButton>
                    <CButton color="primary" >
                        Thêm
                    </CButton>
                </CModalFooter>
            </CModal>

        </div>
    );
}

export default QuyGD
