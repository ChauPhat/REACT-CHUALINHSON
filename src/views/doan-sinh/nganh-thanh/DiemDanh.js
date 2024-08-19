import React, { useState } from 'react';
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

    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

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

    // Hàm tính toán dữ liệu hiển thị cho trang hiện tại
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Tổng số trang
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Thay đổi số hàng hiển thị
    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi số hàng hiển thị
    };

    // Thay đổi trang hiện tại
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <h1>Điểm Danh Ngành Thanh</h1>
            <div className='card'>
                <div className='card-header'>
                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <label htmlFor="timKiemTuan" className="col-form-label">Tuần</label>
                        </div>
                        <div className="col-auto">
                            <input
                                type="text"
                                id="timKiemTuan"
                                className="form-control"
                                value={searchTerm.tuan}
                                onChange={(e) => setSearchTerm({ ...searchTerm, tuan: e.target.value })}
                            />
                        </div>
                        <div className="col-auto">
                            <label htmlFor="timKiemNgay" className="col-form-label">Ngày sinh hoạt</label>
                        </div>
                        <div className="col-auto">
                            <input
                                type="date"
                                id="timKiemNgay"
                                className="form-control"
                                value={searchTerm.ngaySinhHoat}
                                onChange={(e) => setSearchTerm({ ...searchTerm, ngaySinhHoat: e.target.value })}
                            />
                        </div>
                        <div className="col-auto">
                            <label htmlFor="timKiemNam" className="col-form-label">Năm</label>
                        </div>
                        <div className="col-auto">
                            <input
                                type="text"
                                id="timKiemNam"
                                className="form-control"
                                value={searchTerm.nam}
                                onChange={(e) => setSearchTerm({ ...searchTerm, nam: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
                <div className='card-body table-responsive-md'>
                    {filteredData.length === 0 ? (
                        <div className="alert alert-warning" role="alert">
                            Không tìm thấy dữ liệu!
                        </div>
                    ) : (
                        <table className='table table-border table-striped table-hover'>
                            <thead>
                                <tr className='text-center align-items-center'>
                                    <th>Tuần</th>
                                    <th>Ngày sinh hoạt</th>
                                    <th>Năm</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((item) => (
                                    <tr className='text-center justify-content-center align-items-center' key={item.ishd_id}>
                                        <td className='align-items-center'>{item.stt_tuan}</td>
                                        <td>{formatDate(item.ngay_sinh_hoat)}</td>
                                        <td>{item.nam}</td>
                                        <td id='nuiDiemDanhId'>
                                            <button
                                                className='btn btn-outline-success '
                                                data-bs-toggle="modal"
                                                data-bs-target="#exampleModal">
                                                Điểm danh
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

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
                            <span className='me-2'>Dòng:</span>
                            <div>
                                <div className="dropdown">
                                    <a className="btn btn-outline-success dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {itemsPerPage}
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#" onClick={() => handleItemsPerPageChange(5)}>5</a></li>
                                        <li><a className="dropdown-item" href="#" onClick={() => handleItemsPerPageChange(10)}>10</a></li>
                                        <li><a className="dropdown-item" href="#" onClick={() => handleItemsPerPageChange(15)}>15</a></li>
                                        <li><a className="dropdown-item" href="#" onClick={() => handleItemsPerPageChange(20)}>20</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                                        <th>Tên</th>
                                        <th>Ngày sinh hoạt</th>
                                        <th>Đoàn</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className=' justify-content-center align-items-center'>
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