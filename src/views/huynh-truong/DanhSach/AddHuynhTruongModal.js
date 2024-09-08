import React, { useState, useRef, useEffect   } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { 
  CRow , CContainer, 
  CCol, CFormSelect, 
} from '@coreui/react'
import './UserModal.css';
import axios from 'axios';
import env from '../../../env'
import Swal from 'sweetalert2';

function AddHuynhTruongModal({ show, handleClose, onAddHuynhTruong}) {
  const [name, setName] = useState('');
  const [role1, setRole1] = useState(''); 
  const [role2, setRole2] = useState(''); 
  const [phapdanh, setPhapdanh] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [registered, setRegistered] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Male');
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [rolesWithDoanId, setRolesWithDoanId] = useState([]);
  const [rolesWithoutDoanId, setRolesWithoutDoanId] = useState([]);
  const fileInputRef = useRef(null);
  const [bacHoc, setBacHoc] = useState('');
  const [bacHocList, setBacHocList] = useState([]);

  useEffect(() => {
    setRegistered(new Date().toISOString().split('T')[0]);

    const fetchRoles = async () => {
      try {
        // Fetch roles as before
        const response = await axios.get(`${env.apiUrl}/api/role?isHuynhTruong=true`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const fetchedRoles = response.data.data;
        const rolesWithDoanId = fetchedRoles.filter((role) => role.doanId !== null);
        const rolesWithoutDoanId = fetchedRoles.filter((role) => role.doanId === null);
  
        setRolesWithDoanId(rolesWithDoanId);
        setRolesWithoutDoanId(rolesWithoutDoanId);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    // Fetch Bac Hoc
      const fetchBacHoc = async () => {
        try {
          const response = await axios.get(`${env.apiUrl}/api/bac-hoc/get-all`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setBacHocList(response.data.data);
        } catch (error) {
          console.error('Error fetching Bac Hoc:', error);
        }
      };
    
      fetchRoles();
      fetchBacHoc();
    }, []);


    const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'role1':
        setRole1(value);
        break;
      case 'role2':
        setRole2(value);
        break;
      case 'phapdanh':
        setPhapdanh(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'birthDate':
        setBirthDate(value);
        break;
      case 'registered':
        setRegistered(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'gender':
        setGender(value);
        break;
      case 'bacHoc':
        setBacHoc(value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!name) {
      newErrors.name = 'Họ và tên là bắt buộc';
      isValid = false;
    } if (!birthDate) {
      newErrors.birthDate = 'Ngày sinh là bắt buộc';
      isValid = false;
    } if (!role1 && !role2) {
      newErrors.role = 'Ít nhất một chức vụ phải được chọn';
      isValid = false;
    }if (!phone) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
      isValid = false;
    } if (!gender) {
      newErrors.gender = 'Giới tính là bắt buộc';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleSave = async () => {
    if (!validateForm()) return;
  
    const result = await Swal.fire({
      title: 'Xác nhận!',
      text: 'Bạn có chắc chắn muốn thêm Huynh Trưởng  này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, thêm!',
      cancelButtonText: 'Hủy',
    });
  
    if (result.isDenied || result.isDismissed) return;
    

    const formData = {
      hoTen: name,
      ngaySinh: birthDate,
      sdt: phone,
      email: email,
      phapDanh: phapdanh,
      gioiTinh: gender === 'Male', // true for Male, false for Female
      createdDate: registered,
      isHuynhTruong: true,
      updatedDate: new Date().toISOString().split('T')[0], // Current date as string
      diaChi: address,
      isActive: true,
      roleId1:  role1 ? { roleId: role1 } : null, // Assume role1 comes from a select input
      roleId2:  role2 ? { roleId: role2 } : null, // Assume role2 comes from a select input
      lichSuHocs: bacHoc ? [{ bacHocId: bacHoc }] : [], // Assume bacHoc comes from a select input 
      accountDTO: null
    };
    console.log(formData)

    try {
      // First API call to add Bac Hoc
      const response = await axios.post(`${env.apiUrl}/api/users/createUser`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (selectedFile) {
        try {
          const fileFormData = new FormData();
          fileFormData.append('file', selectedFile);
          const userId = response.data.data.userId
          // Second API call to upload the file
          await axios.post(`${env.apiUrl}/api/file/upload-img?userId=${userId}`, fileFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        } catch (fileUploadError) {
          console.error('Lỗi khi upload file:', fileUploadError);
          Swal.fire({
            title: 'Thông báo từ hệ thống!',
            text: 'Thêm Huynh Trưởng thất bại do lỗi upload file.',
            icon: 'error',
          });
  
          return;
        }
      }
  
      // Only proceed if both actions succeed
      const newHuynhTruong = {
        id: response.data.data.bacHocId,
        name,
        role1,
        role2,
        phapdanh,
        email,
        birthDate,
        registered,
        phone,
        address,
        gender,
      };
      onAddHuynhTruong(newHuynhTruong);
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: 'Thêm Huynh Trưởng Thành Công!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
      });

      setName('');
      setRole1('');
      setRole2('');
      setPhapdanh('');
      setEmail('');
      setBirthDate('');
      setRegistered('');
      setPhone('');
      setAddress('');
      setGender('Male');
      setSelectedFile(null);
      handleClose();
    } catch (error) {
      // Handle error when adding Bac Hoc
      const errorMessage = error.response?.data?.message || 'Thêm bậc học thất bại.';
      Swal.fire({
        title: 'Thông báo từ hệ thống!',
        text: errorMessage,
        icon: 'error',
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Huynh Trưởng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="avatar-container">
        <img
            src={selectedFile ? URL.createObjectURL(selectedFile) : 'path/to/default/avatar.png'}
            alt="Avatar" className="user-avatar"
          />
          <input
            type="file" style={{ display: 'block', marginTop: '10px' }} ref={fileInputRef}
            onChange={handleFileChange} accept=".jpg,.jpeg,.png" className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Họ Và Tên</label>
          <div className="input-group">
            <input
              id="name" name="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              type="text" value={name} onChange={handleInputChange} required/>
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
         
          
          <label htmlFor="role">Chức Vụ</label>
          <CContainer className="px-1">
            <CRow>
              <CCol>
                <CFormSelect
                  name="role1" aria-label="Chức Vụ 1"
                  value={role1} onChange={handleInputChange}
                  className={`${errors.role ? 'is-invalid' : ''}`}
                >
                  <option value="">Chọn chức vụ 1</option>
                  {rolesWithDoanId.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol>
                <CFormSelect
                  name="role2" aria-label="Chức Vụ 2"
                  value={role2} onChange={handleInputChange}
                  className={`${errors.role ? 'is-invalid' : ''}`}
                >
                  <option value="">Chọn chức vụ 2</option>
                  {rolesWithoutDoanId.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            {errors.role && <div className="invalid-feedback d-block">{errors.role}</div>}
          </CContainer>


          <label htmlFor="phapdanh">Pháp Danh</label>
          <input
            name="phapdanh" className="form-control"
            type="text" value={phapdanh}
            onChange={handleInputChange}
          />

        
          <label htmlFor="bacHoc">Bậc Học</label>
        <CFormSelect
          name="bacHoc"
          aria-label="Chọn bậc học"
          value={bacHoc} // Correctly assign the state value here
          onChange={handleInputChange} // Handle change correctly
        >
          <option value="">Chọn bậc học</option>
          {bacHocList.map((bacHoc) => (
            <option key={bacHoc.bacHocId} value={bacHoc.bacHocId}>
              {bacHoc.tenBacHoc}
            </option>
          ))}
        </CFormSelect>

          <label htmlFor="email">Email</label>
          <input
            name="email" className="form-control"
            type="email" value={email}
            onChange={handleInputChange}
          />

          <label htmlFor="birthDate">Ngày Sinh</label>
          <input
            id="birthDate" name="birthDate" className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
            type="date" value={birthDate} onChange={handleInputChange} required
          />
          {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}

          <label htmlFor="registered">Ngày Gia Nhập</label>
          <input
            name="registered" className="form-control"
            type="date" value={registered}
            onChange={handleInputChange}
          />

          <label htmlFor="phone">Số Điện Thoại</label>
          <input
            id="phone" name="phone" className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            type="text" value={phone} onChange={handleInputChange} required
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}

          <label>Giới Tính</label>
          <div className="radio-group">
            <label className="radio-inline">
              <input type="radio" name="gender"
                value="Male" checked={gender === 'Male'}
                onChange={handleInputChange} required
              />
              Nam
            </label>
            <label className="radio-inline">
              <input
                type="radio" name="gender"
                value="Female" checked={gender === 'Female'}
                onChange={handleInputChange} required
              />
              Nữ
            </label>
          </div>
          {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}

          <label htmlFor="address">Địa Chỉ</label>
          <textarea
            name="address" className="form-control"
            rows="3" value={address} onChange={handleInputChange}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="footer-container">
          <div className="form-check form-switch">
           
          </div>
          <div className="footer-buttons">
            <Button className='custom-badge-success' variant="secondary" onClick={handleSave} >
              Save
            </Button>
            <Button className='custom-badge-danger' variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default AddHuynhTruongModal;
