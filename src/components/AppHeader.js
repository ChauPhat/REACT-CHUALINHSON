import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          {/* <CNavItem>
            <CNavLink to="/" as={NavLink}>
              Trang Chủ
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Profile</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem> */}
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
        <CDropdown variant="nav-item" direction="dropup-center">
          <CDropdownToggle caret={false}>
            <CIcon icon={cilBell} size="lg" />
          </CDropdownToggle>
          <CDropdownMenu className="p-0" style={{ minWidth: '300px' }}>
            {/* Header */}
            <div className="dropdown-header bg-light text-center font-weight-bold">
              Thông Báo
            </div>

            {/* Body with Scroll */}
            <div
              className="p-2"
              style={{
                maxHeight: '250px', // Chiều cao tối đa cho phần body
                overflowY: 'auto', // Thêm thanh trượt khi nội dung vượt quá chiều cao
              }}
            >
              <CDropdownItem href="#">Thông báo 1</CDropdownItem>
              <CDropdownItem href="#">Thông báo 2</CDropdownItem>
              <CDropdownItem href="#">Thông báo 3</CDropdownItem>
              <CDropdownItem href="#">Thông báo 4</CDropdownItem>
              <CDropdownItem href="#">Thông báo 5</CDropdownItem>
              <CDropdownItem href="#">Thông báo 6</CDropdownItem>
              <CDropdownItem href="#">Thông báo 7</CDropdownItem>
              <CDropdownItem href="#">Thông báo 8</CDropdownItem>
              <CDropdownItem href="#">Thông báo 1</CDropdownItem>
              <CDropdownItem href="#">Thông báo 2</CDropdownItem>
              <CDropdownItem href="#">Thông báo 3</CDropdownItem>
              <CDropdownItem href="#">Thông báo 4</CDropdownItem>
              <CDropdownItem href="#">Thông báo 5</CDropdownItem>
              <CDropdownItem href="#">Thông báo 6</CDropdownItem>
              <CDropdownItem href="#">Thông báo 7</CDropdownItem>
              <CDropdownItem href="#">Thông báo 8</CDropdownItem>
              <CDropdownItem href="#">Thông báo 1</CDropdownItem>
              <CDropdownItem href="#">Thông báo 2</CDropdownItem>
              <CDropdownItem href="#">Thông báo 3</CDropdownItem>
              <CDropdownItem href="#">Thông báo 4</CDropdownItem>
              <CDropdownItem href="#">Thông báo 5</CDropdownItem>
              <CDropdownItem href="#">Thông báo 6</CDropdownItem>
              <CDropdownItem href="#">Thông báo 7</CDropdownItem>
              <CDropdownItem href="#">Thông báo 8</CDropdownItem>
            </div>
          </CDropdownMenu>
        </CDropdown>

          {/*  <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem> */}
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Sáng
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Tối
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Tự Động
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
