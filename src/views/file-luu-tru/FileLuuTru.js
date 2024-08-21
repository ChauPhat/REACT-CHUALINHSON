import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
    CInputGroup
} from '@coreui/react'
import '../doan-sinh/nganh-thanh/DanhSach.css'
import Table from '../table/Table'
import env from '../../env'

// Hàm format date từ dd-mm-yyyy sang đối tượng Date
const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
}



const FileLuuTru = () => {
    const MySwal = withReactContent(Swal);

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [searchName, setSearchName] = useState('')
    const [searchRegistered, setSearchRegistered] = useState('')
    const [searchRole, setSearchRole] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [fileData, setFileData] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useState(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await axios.get(`${env.apiUrl}/api/file/getAllFile`);
            setFileData(response.data.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };


    const filteredData = fileData.filter((user) => {
        const registeredDate = formatDate(user.registered);
        const searchDate = searchRegistered ? searchRegistered.split('-') : [];

        // Nếu chỉ nhập năm
        if (searchDate.length === 1 && searchDate[0].length === 4) {
            const searchYear = parseInt(searchDate[0], 10);
            return (
                (searchName === '' || user.name.toLowerCase().includes(searchName.toLowerCase())) &&
                (searchRole === '' || user.role.toLowerCase().includes(searchRole.toLowerCase())) &&
                (searchStatus === '' || user.status.toLowerCase().includes(searchStatus.toLowerCase())) &&
                registeredDate.getFullYear() === searchYear
            );
        }

        // Nếu nhập đầy đủ ngày-tháng-năm
        if (searchDate.length === 3) {
            const [searchDay, searchMonth, searchYear] = searchDate.map(Number);
            return (
                (searchName === '' || user.name.toLowerCase().includes(searchName.toLowerCase())) &&
                (searchRole === '' || user.role.toLowerCase().includes(searchRole.toLowerCase())) &&
                (searchStatus === '' || user.status.toLowerCase().includes(searchStatus.toLowerCase())) &&
                registeredDate.getDate() === searchDay &&
                registeredDate.getMonth() + 1 === searchMonth &&
                registeredDate.getFullYear() === searchYear
            );
        }

        // Mặc định trả về khi không nhập ngày đăng ký
        return (
            (searchName === '' || user.name.toLowerCase().includes(searchName.toLowerCase())) &&
            (searchRole === '' || user.role.toLowerCase().includes(searchRole.toLowerCase())) &&
            (searchStatus === '' || user.status.toLowerCase().includes(searchStatus.toLowerCase()))
        );
    });


    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
    }

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value)
        setDropdownOpen(false) // Đóng dropdown sau khi chọn
    }

    const dowloadFile = async (name) => {
        let timerInterval;
        MySwal.fire({
            title: "Tải file từ hệ thống",
            html: "Vui lòng đợi hệ thống xử lý <b></b> giây.",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                MySwal.showLoading();
                const timer = MySwal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            if (result.dismiss === MySwal.DismissReason.timer) {
                try {
                    axios.get(`${env.apiUrl}/api/file/downloadFile?fileName=${name}`, {
                        responseType: 'blob', // Nhận dữ liệu dưới dạng Blob
                    })
                        .then(response => {
                            // Dữ liệu Blob từ phản hồi
                            const blob = response.data;

                            // Tạo URL tạm thời cho file và tải xuống
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', name); // Đặt tên file để tải về
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                            window.URL.revokeObjectURL(url); // Giải phóng URL
                        })
                        .catch(error => {
                            console.error('Error downloading file:', error);
                        });

                } catch (error) {
                    MySwal.fire({
                        title: "Lỗi?",
                        text: "Có lỗi trong quá trình tải, vui lòng thử lại!",
                        icon: "error"
                    });
                }
            }
        });
    }

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const uploadFile = (name) => {
        if (selectedFile) {
            const backName = selectedFile.name.split('.').pop().toLowerCase();
            const fileAccess = ['docx', 'xlsx'];
            if (fileAccess.includes(backName)) {
                try {
                    const formData = new FormData();
                    formData.append('file', selectedFile);
                    axios.post(`${env.apiUrl}/api/file/upload-file`, formData ,{
                        headers: {
                        'Content-Type': 'multipart/form-data' // Đảm bảo rằng nội dung là form-data
                        }
                    })
                        .then(response => {
                            MySwal.fire({
                                title: "Thông báo!",
                                text: "Tải ảnh thành công.",
                                icon: "success"
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    fetchFiles();
                                    document.getElementById('clone').click();
                                    fileInputRef.current.value = "";
                                }
                            });
                        })
                        .catch(error => {
                            MySwal.fire({
                                title: "Thông báo!",
                                text: "Có lỗi sinh ra trong quá trinh tải ảnh, vui lòng tải lại.",
                                icon: "error"
                            });
                        });
                } catch (error) {

                }
            } else {
                MySwal.fire({
                    title: "Thông báo!",
                    text: "Vui lòng chọn lại file có đuôi là ( .docx | .xlsx )",
                    icon: "warning"
                });
            }
        } else {
            MySwal.fire({
                title: "Thông báo!",
                text: "Vui lòng chọn file trước khi up",
                icon: "warning"
            });
        }
    }


    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const headers = [
        'Tên',
        'Ngày',
        '',
    ];
    const headerCells = [
        <CFormInput
            type="search"
            placeholder="Tìm theo tên"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
        />,
        <CFormInput
            type="search"
            placeholder="Tìm theo ngày (dd-mm-yyyy)"
            value={searchRegistered}
            onChange={(e) => setSearchRegistered(e.target.value)}
        />,
        "",
    ];

    const renderRow = (user) => (
        <>
            <CTableDataCell>{user.name}</CTableDataCell>
            <CTableDataCell>{user.registered}</CTableDataCell>
            {/* <CTableDataCell>
                <CBadge id='custom-badge' className={getBadgeClass(user.status)}>
                    {user.status}
                </CBadge>
            </CTableDataCell> */}
            <CTableDataCell className="text-center">
                <CButton color="success" variant="outline" onClick={() => dowloadFile(user.name)}>Tải</CButton>
            </CTableDataCell>
        </>
    );


    return (
        <div>
            <div className="container-fluid">
                <CRow className="mb-3 d-flex">
                    <CCol className="d-flex align-items-center flex-grow-1">
                        <h3>File lưu trưu</h3>
                    </CCol>
                    <CCol className="d-flex justify-content-end">
                        <CButton color="secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">Thêm</CButton>
                    </CCol>
                </CRow>

                <Table
                    headers={headers}
                    headerCells={headerCells}
                    items={currentItems}
                    renderRow={renderRow}
                />

                <div className='card-footer align-items-center'>
                    <div className='row d-flex'>
                        <div className='col-6 mb-3'>
                            <nav aria-label="Page navigation example">
                                <ul className="pagination">
                                    <li className="page-item">
                                        <a
                                            className="page-link"
                                            href="#"
                                            aria-label="Previous"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <span aria-hidden="true">&laquo;</span>
                                        </a>
                                    </li>
                                    {[...Array(totalPages).keys()].map(page => (
                                        <li className={`page-item ${currentPage === page + 1 ? 'active' : ''}`} key={page}>
                                            <a
                                                className="page-link"
                                                href="#"
                                                onClick={() => handlePageChange(page + 1)}
                                            >
                                                {page + 1}
                                            </a>
                                        </li>
                                    ))}
                                    <li className="page-item">
                                        <a
                                            className="page-link"
                                            href="#"
                                            aria-label="Next"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <span aria-hidden="true">&raquo;</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className='col-6 d-flex justify-content-end'>
                            <span className='me-2 mt-1'>Dòng:</span>
                            <div className="dropdown">
                                <button
                                    className="btn btn-outline-secondary dropdown-toggle"
                                    type="button"
                                    onClick={toggleDropdown}
                                >
                                    {itemsPerPage}
                                </button>
                                {dropdownOpen && (
                                    <ul className="dropdown-menu show">
                                        <li>
                                            <button className="dropdown-item" onClick={() => handleItemsPerPageChange(5)}>
                                                5
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={() => handleItemsPerPageChange(10)}>
                                                10
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={() => handleItemsPerPageChange(15)}>
                                                15
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={() => handleItemsPerPageChange(20)}>
                                                20
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Tải File</h1>
                        </div>
                        <div className="modal-body">
                            <CInputGroup className="">
                                <CFormInput type="file" id="inputGroupFile02" accept=".docx, .xlsx" ref={fileInputRef} onChange={handleFileChange} />
                            </CInputGroup>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id='clone'>Thoát</button>
                            <button type="button" className="btn btn-primary" onClick={uploadFile}>Lưu</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FileLuuTru