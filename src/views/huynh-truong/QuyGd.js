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

const QuyGD = () => {
    const [searchName, setSearchName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [fundData, setFundData] = useState([]);
    const [fundData2, setFundData2] = useState([]);
    const [newFund, setNewFund] = useState({
        quyGdId: 0,
        description: '',
        amount: 0,
    })

    useEffect(() => {
        const fetchFundData = async () => {
            try {
                const response = await axios.get(`${env.apiUrl}/api/quygiadinh/getListLichQuyGiaDinh`);
                const apiData = response.data.data;

                console.log('apiData:', apiData);

                const formattedData = apiData.flatMap((fund) =>
                    fund.quyGd.map((item) => ({
                        quyGdId: fund.quyGdId || 'Chưa có tên quỹ nên để tạm id',
                        description: item.mo_Ta || 'Không có mô tả',
                        amount: item.so_tien || 0,
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
        searchName === '' || fund.quyGdId.toLowerCase().includes(searchName.toLowerCase())
    );

    const formatAmount = (amount) => {
        return amount > 0 ? `+${amount}` : amount < 0 ? `-${Math.abs(amount)}` : amount;
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFund(prev => ({
            ...prev,
            [name]: value,
        }));
    };



    const headers = [
        <CTableDataCell width={'30%'}>Tên Thu Chi</CTableDataCell>,
        <CTableDataCell width={'30%'}>Số tiền</CTableDataCell>,
        <CTableDataCell width={'40%'}>Mô tả</CTableDataCell>
    ];

    const headerCells = [
        <CFormInput
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
            <CTableDataCell>{fund.quyGdId}</CTableDataCell>
            <CTableDataCell
                style={{ color: fund.amount < 0 ? 'red' : 'green' }}
            >
                {formatAmount(fund.amount)} <label className="text-white"> VNĐ</label>
            </CTableDataCell>
            <CTableDataCell>{fund.description}</CTableDataCell>
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
                searchCriteria={{ searchName }} // truyền nhiều giá trị tìm kiếm vào Table nếu mày thích
            />

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
