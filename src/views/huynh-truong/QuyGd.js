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
    CTableDataCell
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
        description: '',
        thu_hoac_chi: false,
        amount: 0,
    })
    const [selectedDescription, setSelectedDescription] = useState('');

    useEffect(() => {
        const fetchFundData = async () => {
            try {
                const response = await axios.get(`${env.apiUrl}/api/quygiadinh/getListLichQuyGiaDinh`);
                const apiData = response.data.data;

                console.log(apiData);


                const formattedData = apiData.flatMap((fund) =>
                    fund.quyGd.map((item) => ({
                        tenThuChi: item.ten_thu_chi || 'Chưa có tên quỹ',
                        description: item.mo_ta || 'Không có mô tả',
                        amount: item.so_tien || 0,
                        thu_hoac_chi: item.thu_hoac_chi,
                    }))
                );

                //truyền giá trị qua widgetBrand
                let totalAmount = 0;
                let totalIncome = 0;
                let totalExpense = 0;

                apiData.forEach(fund => {
                    fund.quyGd.forEach(item => {
                        const amount = item.so_tien || 0;
                        totalAmount += amount;

                        if (item.thu_hoac_chi) {
                            totalIncome += amount;
                        } else {
                            totalExpense += amount;
                        }
                    });
                });

                setFundData(formattedData);
                setFundData2({ totalAmount, totalIncome, totalExpense });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchFundData();
    }, []);

    const filteredData = fundData.filter((fund) =>
        searchName === '' || fund.tenQuy.toLowerCase().includes(searchName.toLowerCase())
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
                <label style={{ color: fund.thu_hoac_chi ? 'green' : 'red' }}> {(fund.thu_hoac_chi) ? '+' : '-'}{fund.amount}</label>  <label className=""> VNĐ</label>
            </CTableDataCell>
            <CTableDataCell>
                <CButton color="primary" onClick={() => {
                    setSelectedDescription(fund.description);
                    setModalVisible2(true);
                }}>Xem mô tả</CButton>
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
                    {selectedDescription.split('-').map((line, index) => {
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
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
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
