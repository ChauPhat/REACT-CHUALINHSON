import React, { useState } from 'react'
import {
    CBadge,
    CFormSelect,
    CAvatar,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CContainer,
    CRow,
    CPagination,
    CPaginationItem,
    CForm,
    CFormInput,
    CButton,
    CCol,
} from '@coreui/react'
import Table from '../../table/Table'
import './diemanhnganhthanh.css';

const DDNganhThanh = () => {
    // Dữ liệu mẫu
    const [data, setData] = useState([
        { ishd_id: 1, doan_id: 101, user_update: 1001, ngay_sinh_hoat: "2024-08-20", nam: 2024, stt_tuan: 1 },
        { ishd_id: 2, doan_id: 102, user_update: 1002, ngay_sinh_hoat: "2024-08-27", nam: 2024, stt_tuan: 2 },
        { ishd_id: 3, doan_id: 103, user_update: 1003, ngay_sinh_hoat: "2024-09-03", nam: 2024, stt_tuan: 3 },
        { ishd_id: 4, doan_id: 104, user_update: 1004, ngay_sinh_hoat: "2024-09-10", nam: 2024, stt_tuan: 4 },
        { ishd_id: 5, doan_id: 105, user_update: 1005, ngay_sinh_hoat: "2024-09-17", nam: 2024, stt_tuan: 5 },
        { ishd_id: 6, doan_id: 106, user_update: 1006, ngay_sinh_hoat: "2024-08-20", nam: 2024, stt_tuan: 6 },
        { ishd_id: 7, doan_id: 107, user_update: 1007, ngay_sinh_hoat: "2024-08-27", nam: 2024, stt_tuan: 7 },
        { ishd_id: 8, doan_id: 108, user_update: 1008, ngay_sinh_hoat: "2024-09-03", nam: 2024, stt_tuan: 8 },
        { ishd_id: 9, doan_id: 109, user_update: 1009, ngay_sinh_hoat: "2024-09-10", nam: 2024, stt_tuan: 9 },
        { ishd_id: 10, doan_id: 110, user_update: 1010, ngay_sinh_hoat: "2024-09-17", nam: 2024, stt_tuan: 10 }
        // Thêm dữ liệu mẫu nếu cần
    ]);

    const [searchTerm, setSearchTerm] = useState({
        tuan: '',
        ngaySinhHoat: '',
        nam: ''
    });

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };

    // Hàm lọc dữ liệu dựa trên tìm kiếm
    const filteredData = data.filter(item => {
        return (
            (searchTerm.tuan === '' || item.stt_tuan.toString().includes(searchTerm.tuan)) &&
            (searchTerm.ngaySinhHoat === '' || item.ngay_sinh_hoat.includes(searchTerm.ngaySinhHoat)) &&
            (searchTerm.nam === '' || item.nam.toString().includes(searchTerm.nam))
        );
    });

    const headers = [
        <CTableDataCell width={'30%'}>Tuần</CTableDataCell>,
        <CTableDataCell width={'30%'}>Ngày sinh hoạt</CTableDataCell>,
        <CTableDataCell width={'30%'}>Năm</CTableDataCell>,
        <CTableDataCell width={'10%'}></CTableDataCell>,
    ];
    const headerCells = [
        <CFormInput
            type="search"
            placeholder="Tìm theo tuần"
            value={searchTerm.tuan}
            onChange={(e) => setSearchTerm({ ...searchTerm, tuan: e.target.value })}
        />,
        <CFormInput
            type="search"
            placeholder="Tìm theo ngày sinh hoạt"
            value={searchTerm.ngaySinhHoat}
            onChange={(e) => setSearchTerm({ ...searchTerm, ngaySinhHoat: e.target.value })}
        />,
        <CFormInput
            type="search"
            placeholder="Tìm theo năm"
            value={searchTerm.nam}
            onChange={(e) => setSearchTerm({ ...searchTerm, nam: e.target.value })}
        />,
        ''
    ];

    const renderRow = (item) => (
        <>
            <CTableDataCell>{item.stt_tuan}</CTableDataCell>
            <CTableDataCell>{formatDate(item.ngay_sinh_hoat)}</CTableDataCell>
            <CTableDataCell>{item.nam}</CTableDataCell>
            <CTableDataCell>
                <CButton color="info" variant="outline" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Điểm danh
                </CButton>
            </CTableDataCell>
        </>
    );

    return (
        <div className="container-fluid">
            <CRow className="mb-3 d-flex">
                <CCol className="d-flex align-items-center flex-grow-1">
                    <h3>Điểm Danh</h3>
                </CCol>
            </CRow>

            <Table
                headers={headers}
                headerCells={headerCells}
                items={filteredData}
                renderRow={renderRow}
                searchCriteria={{ searchTerm }}
            />

            {/* Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Điểm danh</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <table className='table table-border table-striped table-hover'>
                                <thead>
                                    <tr className='text-center align-items-center'>
                                        <th>Ảnh</th>
                                        <th>Tên</th>
                                        <th>Ngày sinh hoạt</th>
                                        <th>Đoàn</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className=' justify-content-center align-items-center'>
                                        <td>
                                            <img
                                                src="/src/assets/images/avatars/8.jpg"
                                                alt="Ảnh"
                                                className="rounded-image"
                                                width="50"
                                                height="50"
                                            />
                                        </td>
                                        <td>Tui tên Tài</td>
                                        <td>27-08-2004</td>
                                        <td>Người Cộng sản Việt Nam</td>
                                        <td className='justify-content-end '>
                                            <div className="checkbox-con">
                                                <input id="checkbox" type="checkbox"></input>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className=' justify-content-center align-items-center'>
                                        <td>
                                            <img
                                                src="/src/assets/images/avatars/8.jpg"
                                                alt="Ảnh"
                                                className="rounded-image"
                                                width="50"
                                                height="50"
                                            />
                                        </td>
                                        <td>Tui tên Tài</td>
                                        <td>27-08-2004</td>
                                        <td>Người Cộng sản Việt Nam</td>
                                        <td className='justify-content-end '>
                                            <div className="checkbox-con">
                                                <input id="checkbox" type="checkbox"></input>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className=' justify-content-center align-items-center'>
                                        <td>
                                            <img
                                                src="/src/assets/images/avatars/8.jpg"
                                                alt="Ảnh"
                                                className="rounded-image"
                                                width="50"
                                                height="50"
                                            />
                                        </td>
                                        <td>Tui tên Tài</td>
                                        <td>27-08-2004</td>
                                        <td>Người Cộng sản Việt Nam</td>
                                        <td className='justify-content-end '>
                                            <div className="checkbox-con">
                                                <input id="checkbox" type="checkbox"></input>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className=' justify-content-center align-items-center'>
                                        <td>
                                            <img
                                                src="/src/assets/images/avatars/8.jpg"
                                                alt="Ảnh"
                                                className="rounded-image"
                                                width="50"
                                                height="50"
                                            />
                                        </td>
                                        <td>Tui tên Tài</td>
                                        <td>27-08-2004</td>
                                        <td>Người Cộng sản Việt Nam</td>
                                        <td className='justify-content-end '>
                                            <div className="checkbox-con">
                                                <input id="checkbox" type="checkbox"></input>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className=' justify-content-center align-items-center'>
                                        <td>
                                            <img
                                                src="/src/assets/images/avatars/8.jpg"
                                                alt="Ảnh"
                                                className="rounded-image"
                                                width="50"
                                                height="50"
                                            />
                                        </td>
                                        <td>Tui tên Tài</td>
                                        <td>27-08-2004</td>
                                        <td>Người Cộng sản Việt Nam</td>
                                        <td className='justify-content-end '>
                                            <div className="checkbox-con">
                                                <input id="checkbox" type="checkbox"></input>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className=' justify-content-center align-items-center'>
                                        <td>
                                            <img
                                                src="/src/assets/images/avatars/8.jpg"
                                                alt="Ảnh"
                                                className="rounded-image"
                                                width="50"
                                                height="50"
                                            />
                                        </td>
                                        <td>Tui tên Tài</td>
                                        <td>27-08-2004</td>
                                        <td>Người Cộng sản Việt Nam</td>
                                        <td className='justify-content-end '>
                                            <div className="checkbox-con">
                                                <input id="checkbox" type="checkbox"></input>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className=' justify-content-center align-items-center'>
                                        <td>
                                            <img
                                                src="/src/assets/images/avatars/8.jpg"
                                                alt="Ảnh"
                                                className="rounded-image"
                                                width="50"
                                                height="50"
                                            />
                                        </td>
                                        <td>Tui tên Tài</td>
                                        <td>27-08-2004</td>
                                        <td>Người Cộng sản Việt Nam</td>
                                        <td className='justify-content-end '>
                                            <div className="checkbox-con">
                                                <input id="checkbox" type="checkbox"></input>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className=' justify-content-center align-items-center'>
                                        <td>
                                            <img
                                                src="/src/assets/images/avatars/8.jpg"
                                                alt="Ảnh"
                                                className="rounded-image"
                                                width="50"
                                                height="50"
                                            />
                                        </td>
                                        <td>Tui tên Tài</td>
                                        <td>27-08-2004</td>
                                        <td>Người Cộng sản Việt Nam</td>
                                        <td className='justify-content-end '>
                                            <div className="checkbox-con">
                                                <input id="checkbox" type="checkbox"></input>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className=' justify-content-center align-items-center'>
                                        <td>
                                            <img
                                                src="/src/assets/images/avatars/8.jpg"
                                                alt="Ảnh"
                                                className="rounded-image"
                                                width="50"
                                                height="50"
                                            />
                                        </td>
                                        <td>Tui tên Tài</td>
                                        <td>27-08-2004</td>
                                        <td>Người Cộng sản Việt Nam</td>
                                        <td className='justify-content-end '>
                                            <div className="checkbox-con">
                                                <input id="checkbox" type="checkbox"></input>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className=' justify-content-center align-items-center'>
                                        <td>
                                            <img
                                                src="/src/assets/images/avatars/8.jpg"
                                                alt="Ảnh"
                                                className="rounded-image"
                                                width="50"
                                                height="50"
                                            />
                                        </td>
                                        <td>Tui tên Tài</td>
                                        <td>27-08-2004</td>
                                        <td>Người Cộng sản Việt Nam</td>
                                        <td className='justify-content-end '>
                                            <div className="checkbox-con">
                                                <input id="checkbox" type="checkbox"></input>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className=' justify-content-center align-items-center'>
                                        <td>
                                            <img
                                                src="/src/assets/images/avatars/8.jpg"
                                                alt="Ảnh"
                                                className="rounded-image"
                                                width="50"
                                                height="50"
                                            />
                                        </td>
                                        <td>Tui tên Tài</td>
                                        <td>27-08-2004</td>
                                        <td>Người Cộng sản Việt Nam</td>
                                        <td className='justify-content-end '>
                                            <div className="checkbox-con">
                                                <input id="checkbox" type="checkbox"></input>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Thoát</button>
                            <button type="button" className="btn btn-primary">Lưu</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default DDNganhThanh;