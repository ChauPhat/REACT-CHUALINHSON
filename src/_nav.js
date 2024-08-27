import {
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
import { Role } from './GlobalVariable'

const _nav = [
  {
    component: CNavItem,
    name: 'Trang Chủ',
    to: '/',
    icon: <CIcon icon={cilHouse} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Quản Lý',
    role: [Role.ROLE_DOANTRUONG_NGANHTHANH, Role.ROLE_DOANTRUONG_OANHVUNAM, Role.ROLE_DOANTRUONG_OANHVUNU, Role.ROLE_DOANTRUONG_THIEUNAM, Role.ROLE_DOANTRUONG_THIEUNU]
  },
  {
    component: CNavGroup,
    name: 'Danh Sách Đoàn Sinh',
    to: '/doan-sinh',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    role: [Role.ROLE_DOANTRUONG_NGANHTHANH, Role.ROLE_DOANTRUONG_OANHVUNAM, Role.ROLE_DOANTRUONG_OANHVUNU, Role.ROLE_DOANTRUONG_THIEUNAM, Role.ROLE_DOANTRUONG_THIEUNU],
    items: [
      {
        component: CNavGroup,
        name: 'Đoàn Thiếu Nam',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
        role: [Role.ROLE_DOANTRUONG_THIEUNAM],
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-thieu-nam',
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-thieu-nam',
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-thieu-nam',
          }
        ],
      },
      {
        component: CNavGroup,
        name: 'Đoàn Thiếu Nữ',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
        role: [Role.ROLE_DOANTRUONG_THIEUNU],
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-thieu-nu',
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-thieu-nu',
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-thieu-nu',
          }
        ],
      },
      {
        component: CNavGroup,
        name: 'Đoàn Oanh Vũ Nữ',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
        role: [Role.ROLE_DOANTRUONG_OANHVUNU],
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-oanh-vu-nu',
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-oanh-vu-nu',
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-oanh-vu-nu',
          }
        ],
      },
      {
        component: CNavGroup,
        name: 'Đoàn Oanh Vũ Nam',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
        role: [Role.ROLE_DOANTRUONG_OANHVUNAM],
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-oanh-vu-nam',
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-oanh-vu-nam',
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-oanh-vu-nam',
          }
        ],
      },
      {
        component: CNavGroup,
        name: 'Ngành Thanh',
        to: '/ds-doan-sinh',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
        role: [Role.ROLE_DOANTRUONG_NGANHTHANH],
        items: [
          {
            component: CNavItem,
            name: 'Danh Sách',
            to: '/doan-sinh/ds-doan-sinh/ds-nganh-thanh',
          },
          {
            component: CNavItem,
            name: 'Điểm Danh',
            to: '/doan-sinh/dd-nganh-thanh',
          },
          {
            component: CNavItem,
            name: 'Quỹ Đoàn',
            to: '/doan-sinh/qd-nganh-thanh',
          }
        ],
      },
    ],
  },


  {
    component: CNavGroup,
    name: 'Huynh Trưởng',
    to: '/huynh-truong',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    role: [Role.ROLE_ADMIN],
    items: [
      {
        component: CNavItem,
        name: 'Danh sách',
        to: '/huynh-truong/danh-sach',
      },
      {
        component: CNavItem,
        name: 'Tài Khoản',
        to: '/huynh-truong/tai-khoan',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Quỹ Gia Đình',
    to: '/quygd',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    role: [Role.ROLE_THUQUY]
  },
  {
    component: CNavTitle,
    name: 'Tài Liệu',
    role: [Role.ROLE_THUKY]
  },
  {
    component: CNavGroup,
    name: 'File Lưu Trữ',
    to: '/file-luu-tru',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh sách',
        to: '/ds-doan-sinh',
      },
      {
        component: CNavItem,
        name: 'Tài Khoản',
        to: '/huynh-truong/tai-khoan',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Danh Sách thiếu',
    to: '/quygd',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    role: [Role.ROLE_THUQUY]
  },


]

export default _nav
