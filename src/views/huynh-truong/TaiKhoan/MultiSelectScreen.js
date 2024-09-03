import 'primeicons/primeicons.css';
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-dark-indigo/theme.css';
import React, { useEffect, useState } from 'react';
import './MultiSelectScreen.css';
import { useScreens } from '../../../ScreenContext';


export function FilterDemo({ isEditable, selectedScreens, setSelectedScreens }) {

  useEffect(() => {
    // console.dir(selectedScreens);
  }, [isEditable]);

  const { screens } = useScreens();

  // const screens = [
  //   { name: 'Bậc Học', code: 'bac-hoc' },
  //   { name: 'Chức Vụ', code: 'chuc-vu' },
  //   { name: 'Danh Sách Đoàn Sinh', code: 'doan-sinh' },
  //   { name: 'Đoàn Oanh Vũ Nam', code: 'doan-sinh.doan-oanh-vu-nam' },
  //   { name: 'Danh Sách', code: 'doan-sinh.doan-oanh-vu-nam.danh-sach' },
  //   { name: 'Điểm Danh', code: 'doan-sinh.doan-oanh-vu-nam.diem-danh' },
  //   { name: 'Đoàn Phả', code: 'doan-sinh.doan-oanh-vu-nam.doan-pha' },
  //   { name: 'Quỹ Đoàn', code: 'doan-sinh.doan-oanh-vu-nam.quy-doan' },
  //   { name: 'Đoàn Oanh Vũ Nữ', code: 'doan-sinh.doan-oanh-vu-nu' },
  //   { name: 'Danh Sách', code: 'doan-sinh.doan-oanh-vu-nu.danh-sach' },
  //   { name: 'Điểm Danh', code: 'doan-sinh.doan-oanh-vu-nu.diem-danh' },
  //   { name: 'Đoàn Phả', code: 'doan-sinh.doan-oanh-vu-nu.doan-pha' },
  //   { name: 'Quỹ Đoàn', code: 'doan-sinh.doan-oanh-vu-nu.quy-doan' },
  //   { name: 'Đoàn Thiếu Nam', code: 'doan-sinh.doan-thieu-nam' },
  //   { name: 'Danh Sách', code: 'doan-sinh.doan-thieu-nam.danh-sach' },
  //   { name: 'Điểm Danh', code: 'doan-sinh.doan-thieu-nam.diem-danh' },
  //   { name: 'Đoàn Phả', code: 'doan-sinh.doan-thieu-nam.doan-pha' },
  //   { name: 'Quỹ Đoàn', code: 'doan-sinh.doan-thieu-nam.quy-doan' },
  //   { name: 'Đoàn Thiếu Nữ', code: 'doan-sinh.doan-thieu-nu' },
  //   { name: 'Danh Sách', code: 'doan-sinh.doan-thieu-nu.danh-sach' },
  //   { name: 'Điểm Danh', code: 'doan-sinh.doan-thieu-nu.diem-danh' },
  //   { name: 'Đoàn Phả', code: 'doan-sinh.doan-thieu-nu.doan-pha' },
  //   { name: 'Quỹ Đoàn', code: 'doan-sinh.doan-thieu-nu.quy-doan' },
  //   { name: 'Ngành Thanh', code: 'doan-sinh.nganh-thanh' },
  //   { name: 'Danh Sách', code: 'doan-sinh.nganh-thanh.danh-sach' },
  //   { name: 'Điểm Danh', code: 'doan-sinh.nganh-thanh.diem-danh' },
  //   { name: 'Đoàn Phả', code: 'doan-sinh.nganh-thanh.doan-pha' },
  //   { name: 'Quỹ Đoàn', code: 'doan-sinh.nganh-thanh.quy-doan' },
  //   { name: 'File Lưu Trữ', code: 'file-luu-tru' },
  //   { name: 'Hệ Thống', code: 'he-thong' },
  //   { name: 'Huynh Trưởng', code: 'huynh-truong' },
  //   { name: 'Chức Vụ', code: 'huynh-truong.chuc-vu' },
  //   { name: 'Danh Sách', code: 'huynh-truong.danh-sach' },
  //   { name: 'Tài Khoản', code: 'huynh-truong.tai-khoan' },
  //   { name: 'Quản Lý', code: 'quan-ly' },
  //   { name: 'Quỹ Gia Đình', code: 'quy-gia-dinh' },
  //   { name: 'Tài Liệu', code: 'tai-lieu' },
  //   { name: 'Thông Báo', code: 'thong-bao' },
  //   { name: 'Trang Chủ', code: 'trang-chu' },
  // ];

  return (
    <div className="card flex justify-content-center">
      <MultiSelect
        disabled={!isEditable}
        value={selectedScreens}
        options={screens}
        onChange={(e) => setSelectedScreens(e.value)}
        optionLabel="screenName"
        placeholder="Chọn màn hình truy cập"
        display="chip"
        filter
        className="w-full md:w-20rem"
        appendTo="self" // Ensure dropdown is within the modal
      />
    </div>
  );
}
