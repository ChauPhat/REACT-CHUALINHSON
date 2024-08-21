import { CFormSelect, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import React, { useEffect, useState } from 'react';

const Table = ({ headers, headerCells, items, renderRow, searchCriteria }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const maxPageButtons = 3;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchCriteria]);

    const renderPageNumbers = () => {
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        if (endPage - startPage < maxPageButtons - 1) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li
                    className={`page-item ${currentPage === i ? 'active' : ''}`}
                    key={i}
                >
                    <a
                        className="page-link"
                        href="#"
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </a>
                </li>
            );
        }
        return pageNumbers;
    };

    return (
        <>
            <CTable hover responsive striped>
                <CTableHead>
                    <CTableRow>
                        {headers.map((header, index) => (
                            <CTableHeaderCell key={index} style={{ width: header.props.width }}>
                                {header.props.children}
                            </CTableHeaderCell>
                        ))}
                    </CTableRow>
                    <CTableRow>
                        {headerCells.map((headerCell, index) => (
                            <CTableDataCell key={index}>{headerCell}</CTableDataCell>
                        ))}
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <CTableRow key={index}>
                                {renderRow(item)}
                            </CTableRow>
                        ))
                    ) : (
                        <CTableRow>
                            <CTableDataCell colSpan={headers.length} className="text-center">
                                Không tìm thấy dữ liệu
                            </CTableDataCell>
                        </CTableRow>
                    )}
                </CTableBody>
            </CTable>

            <div className="card-footer align-items-center">
                <div className="row d-flex">
                    <div className="col-6 mb-3">
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
                                {renderPageNumbers()}
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
                    <div className="col-6 d-flex justify-content-end">
                        <span className="me-2">Dòng:</span>
                        <CFormSelect
                            style={{ width: 'auto', height: '50%' }}
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </CFormSelect>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Table;
