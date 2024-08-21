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
import React, { useState } from 'react';
import Table from '../table/Table';

const fundData = [
    {
        id: 1,
        fundName: 'Quỹ Hỗ Trợ Học Tập',
        transactionName: 'Chi hỗ trợ học phí',
        description: '-50000',
        amount: -50000,
    },
    {
        id: 2,
        fundName: 'Quỹ Du Lịch Hè',
        transactionName: 'Thu đóng góp mùa hè',
        description: '+50000',
        amount: 50000,
    },
    {
        id: 3,
        fundName: 'Quỹ Khám Sức Khỏe',
        transactionName: 'Chi khám sức khỏe định kỳ',
        description: '-50000',
        amount: -50000,
    },
    {
        id: 4,
        fundName: 'Quỹ Sinh Hoạt Gia Đình',
        transactionName: 'Chi mua đồ dùng gia đình',
        description: '-30000',
        amount: -30000,
    },
    {
        id: 5,
        fundName: 'Quỹ Tiết Kiệm',
        transactionName: 'Thu tiền lãi ngân hàng',
        description: '+20000',
        amount: 20000,
    },
    {
        id: 6,
        fundName: 'Quỹ Dự Phòng Khẩn Cấp',
        transactionName: 'Chi mua thuốc men',
        description: '-15000',
        amount: -15000,
    },
    {
        id: 7,
        fundName: 'Quỹ Xã Hội',
        transactionName: 'Thu tiền quyên góp từ thiện',
        description: '+100000',
        amount: 100000,
    },
    {
        id: 8,
        fundName: 'Quỹ Phát Triển Cá Nhân',
        transactionName: 'Chi phí học lớp yoga',
        description: '-25000',
        amount: -25000,
    },
    {
        id: 9,
        fundName: 'Quỹ Bảo Hiểm',
        transactionName: 'Thu bảo hiểm hàng năm',
        description: '+75000',
        amount: 75000,
    },
    {
        id: 10,
        fundName: 'Quỹ An Toàn Lao Động',
        transactionName: 'Chi mua thiết bị an toàn',
        description: '-45000',
        amount: -45000,
    },
    {
        id: 11,
        fundName: 'Quỹ Vui Chơi Giải Trí',
        transactionName: 'Chi mua vé xem phim',
        description: '-20000',
        amount: -20000,
    },
    {
        id: 12,
        fundName: 'Quỹ Phát Triển Sự Nghiệp',
        transactionName: 'Thu tiền học phí lớp nâng cao',
        description: '+50000',
        amount: 50000,
    },
    {
        id: 13,
        fundName: 'Quỹ Văn Hóa',
        transactionName: 'Chi phí mua sách',
        description: '-30000',
        amount: -30000,
    },
    {
        id: 14,
        fundName: 'Quỹ Dự Phòng Bão Lụt',
        transactionName: 'Thu tiền quyên góp bão lụt',
        description: '+100000',
        amount: 100000,
    },
    {
        id: 15,
        fundName: 'Quỹ Tiêu Dùng Cá Nhân',
        transactionName: 'Chi mua đồ dùng cá nhân',
        description: '-40000',
        amount: -40000,
    },
    {
        id: 13,
        fundName: 'Quỹ Văn Hóa',
        transactionName: 'Chi phí mua sách',
        description: '-30000',
        amount: -30000,
    },
    {
        id: 14,
        fundName: 'Quỹ Dự Phòng Bão Lụt',
        transactionName: 'Thu tiền quyên góp bão lụt',
        description: '+100000',
        amount: 100000,
    },
    {
        id: 15,
        fundName: 'Quỹ Tiêu Dùng Cá Nhân',
        transactionName: 'Chi mua đồ dùng cá nhân',
        description: '-40000',
        amount: -40000,
    },
    {
        id: 13,
        fundName: 'Quỹ Văn Hóa',
        transactionName: 'Chi phí mua sách',
        description: '-30000',
        amount: -30000,
    },
    {
        id: 14,
        fundName: 'Quỹ Dự Phòng Bão Lụt',
        transactionName: 'Thu tiền quyên góp bão lụt',
        description: '+100000',
        amount: 100000,
    },
    {
        id: 15,
        fundName: 'Quỹ Tiêu Dùng Cá Nhân',
        transactionName: 'Chi mua đồ dùng cá nhân',
        description: '-40000',
        amount: -40000,
    },
    {
        id: 13,
        fundName: 'Quỹ Văn Hóa',
        transactionName: 'Chi phí mua sách',
        description: '-30000',
        amount: -30000,
    },
    {
        id: 14,
        fundName: 'Quỹ Dự Phòng Bão Lụt',
        transactionName: 'Thu tiền quyên góp bão lụt',
        description: '+100000',
        amount: 100000,
    },
    {
        id: 15,
        fundName: 'Quỹ Tiêu Dùng Cá Nhân',
        transactionName: 'Chi mua đồ dùng cá nhân',
        description: '-40000',
        amount: -40000,
    },
    {
        id: 13,
        fundName: 'Quỹ Văn Hóa',
        transactionName: 'Chi phí mua sách',
        description: '-30000',
        amount: -30000,
    },
    {
        id: 14,
        fundName: 'Quỹ Dự Phòng Bão Lụt',
        transactionName: 'Thu tiền quyên góp bão lụt',
        description: '+100000',
        amount: 100000,
    },
    {
        id: 15,
        fundName: 'Quỹ Tiêu Dùng Cá Nhân',
        transactionName: 'Chi mua đồ dùng cá nhân',
        description: '-40000',
        amount: -40000,
    },
    {
        id: 13,
        fundName: 'Quỹ Văn Hóa',
        transactionName: 'Chi phí mua sách',
        description: '-30000',
        amount: -30000,
    },
    {
        id: 14,
        fundName: 'Quỹ Dự Phòng Bão Lụt',
        transactionName: 'Thu tiền quyên góp bão lụt',
        description: '+100000',
        amount: 100000,
    },
    {
        id: 15,
        fundName: 'Quỹ Tiêu Dùng Cá Nhân',
        transactionName: 'Chi mua đồ dùng cá nhân',
        description: '-40000',
        amount: -40000,
    },
];

const QuyGD = () => {
    const [searchName, setSearchName] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [newFund, setNewFund] = useState({
        fundName: '',
        transactionName: '',
        description: '',
        amount: 0,
    })

    const filteredData = fundData.filter((fund) =>
        searchName === '' || fund.fundName.toLowerCase().includes(searchName.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFund(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddFund = () => {
        fundData.push({
            id: fundData.length + 1,
            ...newFund,
            amount: parseFloat(newFund.amount),
        });
        setModalVisible(false);
        setNewFund({ fundName: '', transactionName: '', description: '', amount: 0 });
    };

    const headers = [
        <CTableDataCell width={30}>Tên Thu Chi</CTableDataCell>,
        <CTableDataCell width={30}>Tên Quỹ</CTableDataCell>,
        <CTableDataCell width={40}>Mô tả</CTableDataCell>
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
            <CTableDataCell>{fund.fundName}</CTableDataCell>
            <CTableDataCell>{fund.transactionName}</CTableDataCell>
            <CTableDataCell
                style={{ color: fund.amount < 0 ? 'red' : 'green' }}
            >
                {fund.description}
            </CTableDataCell>
        </>
    );

    return (
        <div className="container-fluid">
            <CRow className="mb-3 d-flex">
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
                        label="Tên Quỹ"
                        name="fundName"
                        value={newFund.fundName}
                        onChange={handleInputChange}
                        className="mb-3"
                    />
                    <CFormInput
                        label="Tên Thu Chi"
                        name="transactionName"
                        value={newFund.transactionName}
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
                    <CFormInput
                        label="Số tiền"
                        name="amount"
                        value={newFund.amount}
                        type="number"
                        onChange={handleInputChange}
                        className="mb-3"
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalVisible(false)}>
                        Đóng
                    </CButton>
                    <CButton color="primary" onClick={handleAddFund}>
                        Thêm
                    </CButton>
                </CModalFooter>
            </CModal>

        </div>
    );
}

export default QuyGD
