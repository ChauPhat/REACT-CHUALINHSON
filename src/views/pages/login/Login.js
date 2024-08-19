import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import sweetalert from 'sweetalert2'
import env from '../../../env'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (token) {
      navigate('/')
    }
  }, [navigate])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${env.apiUrl}/api/auth/login`, {
        username: username,
        password: password
      })
      console.log(response.data)
      let data = response.data.data
      if (data.token) {
        sessionStorage.setItem('token', data.token)
        let token = sessionStorage.getItem('token')
        if (token) {
          sweetalert.fire({
            icon: "success",
            title: "Đăng nhập thành công",
            showConfirmButton: false,
            timer: 2000
          }).then((result) => {
            if (result.dismiss === sweetalert.DismissReason.timer || result.dismiss === sweetalert.DismissReason.backdrop) {
              window.location.href = '/'
            }
          });
        }
      }
    } catch (error) {
      if (error.response.status === 403) {
        sweetalert.fire({
          icon: "error",
          title: "Sai tên đăng nhập hoặc mật khẩu",
          showConfirmButton: false,
          timer: 2000
        })
        return
      }
      if (error.response) {
        console.error('Login failed:', error.response.data)
        if (error.response.status === 401) {
          alert('Unauthorized: Please check your username and password.')
        }
      } else {
        console.error('Login failed:', error.message)
        alert('Network error: Please try again later.')
      }
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex align-items-center justify-content-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} lg={5} xl={4}>
            <CCard className="p-4 shadow-lg border-0">
              <CCardBody>
                <CForm>
                  <h1 className="text-center mb-4">Đăng Nhập</h1>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Tên đăng nhập"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Mật khẩu"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol xs={12} className="text-center">
                      <CButton
                        color="primary"
                        className="px-5 py-2"
                        onClick={handleLogin} // Gọi handleLogin khi nhấn nút
                      >
                        Đăng nhập
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
