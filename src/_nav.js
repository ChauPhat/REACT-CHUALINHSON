import {
  cilBell,
  cilBook,
  cilFile,
  cilGroup,
  cilHouse,
  cilMoney,
  cilPlus,
  cilUserPlus,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import React from 'react'
const _nav = [
  {
    component: CNavItem,
    name: 'Trang Chủ',
    to: '/',
    icon: <CIcon icon={cilHouse} customClassName='nav-icon' />,
    screen_id: 'trang-chu'
  },
  {
    component: CNavTitle,
    name: 'Quản Lý',
    // role: [Role.ROLE_DOANTRUONG_NGANHTHANH, Role.ROLE_DOANTRUONG_OANHVUNAM, Role.ROLE_DOANTRUONG_OANHVUNU, Role.ROLE_DOANTRUONG_THIEUNAM, Role.ROLE_DOANTRUONG_THIEUNU],
    screen_id: 'quan-ly'
  },
  {
    component: CNavGroup,
    name: 'Danh Sách Đoàn Sinh',
    to: '/doan-sinh',
    icon: <CIcon icon={cilGroup} customClassName='nav-icon' />,
    screen_id: 'doan-sinh',
    // role: [Role.ROLE_DOANTRUONG_NGANHTHANH, Role.ROLE_DOANTRUONG_OANHVUNAM, Role.ROLE_DOANTRUONG_OANHVUNU, Role.ROLE_DOANTRUONG_THIEUNAM, Role.ROLE_DOANTRUONG_THIEUNU],
    items: [
      {
        component: CNavGroup,
        name: 'Đoàn Thiếu Nam',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} customClassName='nav-icon' />,
        // role: [Role.ROLE_DOANTRUONG_THIEUNAM],
        screen_id: 'doan-sinh.doan-thieu-nam',
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-thieu-nam',
            screen_id: 'doan-sinh.doan-thieu-nam.danh-sach'
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-thieu-nam',
            screen_id: 'doan-sinh.doan-thieu-nam.diem-danh'
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-thieu-nam',
            screen_id: 'doan-sinh.doan-thieu-nam.quy-doan'
          },
          {
            component: CNavItem,
            name: 'Đoàn Phả',
            to: '/doan-sinh/dp-thieu-nam',
            screen_id: 'doan-sinh.doan-thieu-nam.doan-pha'
          }
        ],
      },
      {
        component: CNavGroup,
        name: 'Đoàn Thiếu Nữ',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} customClassName='nav-icon' />,
        // role: [Role.ROLE_DOANTRUONG_THIEUNU],
        screen_id: 'doan-sinh.doan-thieu-nu',
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-thieu-nu',
            screen_id: 'doan-sinh.doan-thieu-nu.danh-sach'
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-thieu-nu',
            screen_id: 'doan-sinh.doan-thieu-nu.diem-danh'
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-thieu-nu',
            screen_id: 'doan-sinh.doan-thieu-nu.quy-doan'
          },
          {
            component: CNavItem,
            name: 'Đoàn Phả',
            to: '/doan-sinh/dp-thieu-nu',
            screen_id: 'doan-sinh.doan-thieu-nu.doan-pha'
          }
        ],
      },
      {
        component: CNavGroup,
        name: 'Đoàn Oanh Vũ Nữ',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} customClassName='nav-icon' />,
        // role: [Role.ROLE_DOANTRUONG_OANHVUNU],
        screen_id: 'doan-sinh.doan-oanh-vu-nu',
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-oanh-vu-nu',
            screen_id: 'doan-sinh.doan-oanh-vu-nu.danh-sach'
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-oanh-vu-nu',
            screen_id: 'doan-sinh.doan-oanh-vu-nu.diem-danh'
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-oanh-vu-nu',
            screen_id: 'doan-sinh.doan-oanh-vu-nu.quy-doan'
          },
          {
            component: CNavItem,
            name: 'Đoàn Phả',
            to: '/doan-sinh/dp-oanh-vu-nu',
            screen_id: 'doan-sinh.doan-oanh-vu-nu.doan-pha'
          }
        ],
      },
      {
        component: CNavGroup,
        name: 'Đoàn Oanh Vũ Nam',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} customClassName='nav-icon' />,
        // role: [Role.ROLE_DOANTRUONG_OANHVUNAM],
        screen_id: 'doan-sinh.doan-oanh-vu-nam',
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-oanh-vu-nam',
            screen_id: 'doan-sinh.doan-oanh-vu-nam.danh-sach'
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-oanh-vu-nam',
            screen_id: 'doan-sinh.doan-oanh-vu-nam.diem-danh'
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-oanh-vu-nam',
            screen_id: 'doan-sinh.doan-oanh-vu-nam.quy-doan'
          },
          {
            component: CNavItem,
            name: 'Đoàn Phả',
            to: '/doan-sinh/dp-oanh-vu-nam',
            screen_id: 'doan-sinh.doan-oanh-vu-nam.doan-pha'
          }
        ],
      },
      {
        component: CNavGroup,
        name: 'Ngành Thanh',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} customClassName='nav-icon' />,
        // role: [Role.ROLE_DOANTRUONG_NGANHTHANH],
        screen_id: 'doan-sinh.nganh-thanh',
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-nganh-thanh',
            screen_id: 'doan-sinh.nganh-thanh.danh-sach'
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-nganh-thanh',
            screen_id: 'doan-sinh.nganh-thanh.diem-danh'
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-nganh-thanh',
            screen_id: 'doan-sinh.nganh-thanh.quy-doan'
          },
          {
            component: CNavItem,
            name: 'Đoàn Phả',
            to: '/doan-sinh/dp-nganh-thanh',
            screen_id: 'doan-sinh.nganh-thanh.doan-pha'
          }
        ],
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Huynh Trưởng',
    to: '/huynh-truong',
    icon: <CIcon icon={cilUserPlus} customClassName='nav-icon' />,
    // role: [Role.ROLE_ADMIN],
    screen_id: 'huynh-truong',
    items: [
      {
        component: CNavItem,
        name: 'Danh sách',
        to: '/huynh-truong/danh-sach',
        screen_id: 'huynh-truong.danh-sach'
      },
      {
        component: CNavItem,
        name: 'Tài Khoản',
        to: '/huynh-truong/tai-khoan',
        screen_id: 'huynh-truong.tai-khoan'
      },
      {
        component: CNavItem,
        name: 'Chức Vụ',
        to: '/chuc-vu',
        screen_id: 'huynh-truong.chuc-vu'
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Quỹ Gia Đình',
    to: '/quygd',
    icon: <CIcon icon={cilMoney} customClassName='nav-icon' />,
    // role: [Role.ROLE_THUQUY],
    screen_id: 'quy-gia-dinh'
  },
  {
    component: CNavItem,
    name: 'Bậc Học',
    to: '/bac-hoc',
    icon: <CIcon icon={cilBook} customClassName='nav-icon' />,
    // role: [Role.ROLE_THUQUY],
    screen_id: 'bac-hoc'
  },
  {
    component: CNavTitle,
    name: 'Tài Liệu',
    // role: [Role.ROLE_THUKY],
    screen_id: 'tai-lieu'
  },
  {
    component: CNavItem,
    name: 'File Lưu Trữ',
    to: '/file-luu-tru',
    icon: <CIcon icon={cilFile} customClassName='nav-icon' />,
    screen_id: 'file-luu-tru'
  },
  {
    component: CNavTitle,
    name: 'Hệ Thống',
    // role: [Role.ROLE_THUKY],
    screen_id: 'he-thong'
  },
  {
    component: CNavItem,
    name: 'Thông Báo',
    to: '/thong-bao',
    icon: <CIcon icon={cilBell} customClassName='nav-icon' />,
    screen_id: 'thong-bao'
  },
];


export default _nav
