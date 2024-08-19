import React from 'react';
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell } from '@coreui/react';

const Table = ({ headers, headerCells, items, renderRow }) => {
    return (
        <CTable hover responsive>
            <CTableHead>
                <CTableRow>
                    {headers.map((header, index) => (
                        <CTableHeaderCell key={index}>{header}</CTableHeaderCell>
                    ))}
                </CTableRow>
                <CTableRow>
                    {headerCells.map((headerCell, index) => (
                        <CTableDataCell key={index}>{headerCell}</CTableDataCell>
                    ))}
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {items.length > 0 ? (
                    items.map((item, index) => (
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
    );
};

export default Table;
