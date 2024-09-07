import {
    CButton,
    CCol,
    CFormInput,
    CFormSelect,
    CRow,
    CTableDataCell
} from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import apiClient from '../../../apiClient';
import env from '../../../env';
import Table from '../../table/Table';
import '../DoanSinhCss/DanhSach.css';
import './DiemDanh.css';

const DDNganhThanh = () => {
    const [searchTerm, setSearchTerm] = useState({
        tuan: '',
        ngaySinhHoat: '',
        nam: ''
    });
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 4 }, (_, index) => currentYear + index);
    const [doanId, setDoanId] = useState(5);
    const [lichSinhHoatDoan, setLichSinhHoatDoan] = useState([]);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedLichSinhHoatDoan, setSelectedLichSinhHoatDoan] = useState();

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const addLichSinhHoatDoan = () => {
        Swal.fire({
            icon: 'question',
            title: `Bạn có muốn tạo lịch sinh hoạt năm ${selectedYear} cho đoàn này?`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await apiClient.post(`/api/lichSinhHoatDoan/tao_lich_sinh_hoat`, null, {
                        params: {
                            doan_id: doanId,
                            year: selectedYear
                        }
                    });
                    let timerInterval;
                    Swal.fire({
                        title: "Vui lòng đợi xử lý thông tin!",
                        html: "Tự động đóng sau <b></b> mili giây.",
                        timer: 2000,
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            getLichSinhHoatDoan();
                            Swal.showLoading();
                            const timer = Swal.getPopup().querySelector("b");
                            timerInterval = setInterval(() => {
                                timer.textContent = `${Swal.getTimerLeft()}`;
                            }, 100);
                        },
                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                    }).then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: response.data.message
                        })
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        })
    }

    useEffect(() => {
        getLichSinhHoatDoan();
    }, [])

    const getLichSinhHoatDoan = () => {
        apiClient.get(`/api/lichSinhHoatDoan/tim_kiem_theo_doan_id?`, {
            params: {
                doanId: doanId
            }
        }).then(response => {
            setLichSinhHoatDoan(response.data.data);
        }).catch(error => {
            console.error(error);
        })
    }

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };

    const filteredData = lichSinhHoatDoan?.filter(item => {
        const formattedDate = formatDate(item.ngaySinhHoat);
        return (
            (searchTerm.tuan === '' || item.sttTuan.toString().includes(searchTerm.tuan)) &&
            (searchTerm.ngaySinhHoat === '' || formattedDate.includes(searchTerm.ngaySinhHoat)) &&
            (searchTerm.nam === '' || item.nam.toString().includes(searchTerm.nam))
        );
    });

    const headers = [
        <CTableDataCell width={'30%'} className="fixed-width-column">Tuần</CTableDataCell>,
        <CTableDataCell width={'30%'} className="fixed-width-column">Ngày sinh hoạt</CTableDataCell>,
        <CTableDataCell width={'30%'} className="fixed-width-column">Năm</CTableDataCell>,
        <CTableDataCell width={'10%'} className="fixed-width-column"></CTableDataCell>,
    ];
    const headerCells = [
        <CFormInput className='fixed-width-input'
            type="search"
            placeholder="Tìm theo tuần"
            value={searchTerm.tuan}
            onChange={(e) => setSearchTerm({ ...searchTerm, tuan: e.target.value })}
        />,
        <CFormInput className='fixed-width-input'
            type="search"
            placeholder="Tìm theo ngày sinh hoạt"
            value={searchTerm.ngaySinhHoat}
            onChange={(e) => setSearchTerm({ ...searchTerm, ngaySinhHoat: e.target.value })}
        />,
        <CFormInput className='fixed-width-input'
            type="search"
            placeholder="Tìm theo năm"
            value={searchTerm.nam}
            onChange={(e) => setSearchTerm({ ...searchTerm, nam: e.target.value })}
        />,
        ''
    ];

    const checkDiemDanhDTOS = (item) => {
        var tempFormData = {};
        let userId = JSON.parse(localStorage.getItem('user'))?.user_id;
        item.diemDanhDTOS.forEach(diemDanhDTO => {
            tempFormData = {
                ...tempFormData,
                [diemDanhDTO.diemDanhId]: {
                    diemDanhId: diemDanhDTO.diemDanhId,
                    coMat: diemDanhDTO.coMat,
                    lichSinhHoatDoanId: diemDanhDTO.lichSinhHoatDoanId,
                    userUpdate: userId,
                    doanSinhDetailId: diemDanhDTO.doanSinhDetailDTO.doanSinhDetailId
                }
            }
        });
        setFormData(tempFormData);
        if (item.diemDanhDTOS.length > 0 && item.diemDanhDTOS.some(value => Boolean(value))) {
            setSelectedLichSinhHoatDoan(item)
        } else {
            apiClient.put(`/api/lichSinhHoatDoan/updateDiemDanh/${item.lichSinhHoatDoanId}`)
                .then(response => {
                    getLichSinhHoatDoan();
                    setSelectedLichSinhHoatDoan(response.data.data);
                })
                .catch(error => {
                    console.error(error);
                })
        }
    }

    const [formData, setFormData] = useState({});

    const handleCoMatChange = (checked, diemDanhDTO) => {
        setFormData({
            ...formData,
            [diemDanhDTO.diemDanhId]: {
                ...formData[diemDanhDTO.diemDanhId],
                coMat: checked
            }
        });
    }

    const getFormData = () => {
        var keys = Object.keys(formData);
        return keys?.map(key => {
            return {
                diemDanhId: key,
                coMat: formData[key].coMat,
                lichSinhHoatDoanId: formData[key].lichSinhHoatDoanId,
                userUpdate: formData[key].userUpdate,
                doanSinhDetailId: formData[key].doanSinhDetailId
            }
        })
    }

    const handleSaveDiemDanh = async () => {
        try {
            handleEditToggle();
            const payload = getFormData();
            const response = await apiClient.post(`/api/diem_danh/luu_hoac_cap_nhat_diem_danh`, payload);
            let timerInterval;
            Swal.fire({
                title: "Vui lòng đợi xử lý thông tin!",
                html: "Tự động đóng sau <b></b> mili giây.",
                timer: 2000,
                timerProgressBar: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    getLichSinhHoatDoan();
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Điểm danh thành công!'
                }).then(() => {
                    handleClose();
                })
            });
        } catch (error) {
            console.error(error);
        }
    }


    const [isEditing, setIsEditing] = useState(false);
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    }
    const renderRow = (item) => (
        <>
            <CTableDataCell>{item.sttTuan}</CTableDataCell>
            <CTableDataCell>{formatDate(item.ngaySinhHoat)}</CTableDataCell>
            <CTableDataCell>{item.nam}</CTableDataCell>
            <CTableDataCell>
                <CButton color="info"
                    disabled={getTodayDateString() !== item.ngaySinhHoat}
                    onClick={() => { checkDiemDanhDTOS(item); setShow(true); }}
                    variant="outline" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Điểm danh
                </CButton>
            </CTableDataCell>
        </>
    );
    const getTodayDateString = () => {
        return new Date().toISOString().split('T')[0];
    }

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setIsEditing(false);
    }

    return (
        <div className="container-fluid">
            <CRow className="mb-3 d-flex">
                <CCol className="d-flex align-items-center flex-grow-1">
                    <h3>Lịch sinh hoạt đoàn Ngành Thanh</h3>
                </CCol>
                <CCol className="d-flex justify-content-end">
                    <CFormSelect className="small-select me-2" onChange={handleYearChange}
                        style={{ width: 'auto' }} aria-label="Chọn năm" >
                        {years.map((year) => (
                            <option key={year} value={year}>{year}
                            </option>
                        ))}
                    </CFormSelect>
                    <CButton color="secondary" onClick={addLichSinhHoatDoan}>Thêm</CButton>
                </CCol>
            </CRow>

            <Table
                headers={headers}
                headerCells={headerCells}
                items={filteredData || []}
                renderRow={renderRow}
                searchCriteria={{ searchTerm }}
            />

            <Modal show={show} onHide={handleClose} centered className='modal-lg'>
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title">Điểm danh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='table-responsive'>
                        <table className='table table-border table-striped table-hover'>
                            <thead>
                                <tr className=' align-items-center'>
                                    <th >Ảnh</th>
                                    <th >Tên</th>
                                    <th >Ngày sinh hoạt</th>
                                    <th >Đoàn</th>
                                    <th >Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    selectedLichSinhHoatDoan?.diemDanhDTOS?.map((element) => {
                                        let doanSinh = element.doanSinhDetailDTO;
                                        return (<tr className='align-items-center'>
                                            <td>
                                                <img
                                                    src={`${env.apiUrl}/api/file/get-img?userId=${doanSinh.userId}&t=${Date.now()}`}
                                                    alt="Ảnh"
                                                    className="rounded-image"
                                                    width="50"
                                                    height="50"
                                                />
                                            </td>
                                            <td>{doanSinh.hoTen}</td>
                                            <td>{formatDate(selectedLichSinhHoatDoan.ngaySinhHoat)}</td>
                                            <td>{doanSinh.tenDoan}</td>
                                            <td className=''>
                                                <div className="checkbox-con">
                                                    <input
                                                        id={`checkbox-${element.diemDanhId}`} type="checkbox" disabled={!isEditing}
                                                        checked={formData[element.diemDanhId]?.coMat || false} onChange={(e) => handleCoMatChange(e.target.checked, element)}></input>
                                                </div>
                                            </td>
                                        </tr>);
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="form-check form-switch" >
                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={isEditing} onChange={handleEditToggle} />
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Chỉnh Sửa</label>
                    </div>
                    <div className="footer-buttons">
                        <button type="button" className="btn btn-primary" disabled={!isEditing} onClick={handleSaveDiemDanh}>Lưu</button>
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Thoát</button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DDNganhThanh;