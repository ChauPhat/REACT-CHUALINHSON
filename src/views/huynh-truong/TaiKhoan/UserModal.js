import { useColorModes } from '@coreui/react';
import 'primeicons/primeicons.css';
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/primereact.css';
// import 'primereact/resources/themes/lara-dark-indigo/theme.css';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import apiClient from '../../../apiClient';
import env from '../../../env';
import { useScreens } from '../../../ScreenContext';
import './MultiSelectScreen.css';
import './UserModal.css';
import Swal from 'sweetalert2';

function UserModal({ show, handleClose, user, setUpdated }) {

  const { colorMode } = useColorModes('coreui-free-react-admin-template-theme');
  React.useEffect(() => {
    if (colorMode === 'auto') {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDarkMode) {
        import(`primereact/resources/themes/lara-dark-indigo/theme.css`);
      } else {
        import(`primereact/resources/themes/lara-light-indigo/theme.css`);
      }
    } else if (colorMode === 'light') {
      import('primereact/resources/themes/lara-light-indigo/theme.css');
    } else if (colorMode === 'dark') {
      import('primereact/resources/themes/lara-dark-indigo/theme.css');
    }
  }, [colorMode]);

  // const [roles, setRoles] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    password: user?.password,
    userId: {
      userId: user.userId
    }
  });
  const [selectedScreens, setSelectedScreens] = useState(null);
  const { screens } = useScreens();
  // const [checkedCount, setCheckedCount] = useState(0);

  useEffect(() => {
    // console.dir(user);
    // Update formData when user data changes
    let tempScreens = []; // need optimized
    user?.accountDTO?.screenIds?.forEach(element => {
      for (let screen of screens) {
        if (screen.screenId === element.screenId) {
          tempScreens.push(screen);
          break;
        };
      }
    });
    setSelectedScreens(tempScreens);
    setFormData({
      password: user?.password,
      userId: user.userId
    });
    // const initialRoles = formData.roleOfDoanTruong ? [formData.roleOfDoanTruong] : [];
    // setRoles(initialRoles);
    // setCheckedCount(initialRoles.length);
  }, [user]);

  // useEffect(() => {
  //   // console.dir(selectedScreens);
  //   // setFormData({ ...formData, screenIds: convertSelectedScreensToListScreens() });
  //   // console.dir({ ...formData, screenIds: convertSelectedScreensToListScreens() });
  // }, [selectedScreens]);

  const convertSelectedScreensToListScreens = () => {
    return selectedScreens?.map(element => {
      return {
        accountId: user?.accountDTO?.accountId,
        screenId: element?.screenId
      }
    });
  }

  const getAccountPayload = () => {
    return {
      ...formData,
      screenIds: convertSelectedScreensToListScreens()
    }
  }

  // const addChildScreens = (screen) => {
  //   setSelectedScreens(screen);
  //   screens.forEach(element => {
  //     if (element.screenId.startsWith(screen.screenId)) {
  //       // console.dir(element);
  //       setSelectedScreens(element);
  //     }
  //   });
  // }

  // const handleCheck = (event) => {
  //   const { id, checked } = event.target;
  //   const roleId = parseInt(id.replace('check', ''), 10);

  //   let newCheckedCount = checkedCount;

  //   if (checked) {
  //     newCheckedCount += 1;
  //     setRoles([...roles, roleId]);
  //   } else {
  //     newCheckedCount -= 1;
  //     setRoles(roles.filter(role => role !== roleId));
  //   }

  //   setCheckedCount(newCheckedCount);
  // };

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    setIsEditing(false); // Disable editing mode after saving
    const payload = getAccountPayload();
    Swal.fire({
      icon: 'question',
      title: 'Bạn có đồng ý cập nhật?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await apiClient.put(`/api/accounts/${user?.accountDTO?.accountId}`, payload);
          setUpdated(response.data.data);
          Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành công!'
          });
        } catch (error) {
          console.error(error);
        }
      }
    })
    // try {
    //   // console.dir(payload);
    //   const response = await apiClient.put(`/api/accounts/${user?.accountDTO?.accountId}`, payload);
    //   // const response = await apiClient.put(`/api/accounts/199`, payload);
    //   // console.dir(response.data);
    //   setUpdated(response.data.data);
    // } catch (error) {
    //   console.error('Error update account:', error);
    // }
  };

  // const rolesMapping = {
  //   ROLE_ADMIN: "Admin",
  //   ROLE_THUKY: "Thư ký",
  //   ROLE_THUQUY: "Thủ quỹ",
  //   ROLE_DOANTRUONG: "Đoàn trưởng",
  //   ROLE_DOANTRUONG_OANHVUNAM: "Đoàn trưởng Oanh Vũ Nam",
  //   ROLE_DOANTRUONG_OANHVUNU: "Đoàn trưởng Oanh Vũ Nữ",
  //   ROLE_DOANTRUONG_THIEUNAM: "Đoàn trưởng Thiếu Nam",
  //   ROLE_DOANTRUONG_THIEUNU: "Đoàn trưởng Thiếu Nữ",
  //   ROLE_DOANTRUONG_NGANHTHANH: "Đoàn trưởng Ngành Thanh"
  // };

  // const handleGenderChange = (value) => {
  //   setFormData({
  //     ...formData,
  //     gender: value ? "Male" : "Female",
  //   });
  // };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Thông Tin Tài Khoản</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="avatar-container">
          <img src={`${env.apiUrl}/api/file/get-img?userId=${user.id}&t=${Date.now()}`} alt="Avatar" className="user-avatar" />
        </div>

        <div class="form-group">
          <label for="exampleFormControlInput1">Họ và tên</label>
          <div class="input-group">
            <input id="name" name="name" class="form-control" type="text" value={user.name}
              readOnly />
            <span class="input-group-text " id="basic-addon2">{user.idUX}</span>
          </div>

          <label for="exampleFormControlInput1">Tên người dùng</label>
          <input id="userName" name="userName" class="form-control" type="text" value={user.userName}
            readOnly />

          <label for="exampleFormControlInput1">Mật khẩu</label>
          <input id="password" name="password" class="form-control" type="password" value={formData.password}
            onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing} />

          {/* <label for="exampleFormControlInput1">Email</label>
          <input id="email" name="email" class="form-control" type="email" value={formData.email}
            onChange={handleInputChange} readOnly={!isEditing} disabled={!isEditing} /> */}


          {/* <label>Giới Tính</label>

          <div className="radio-group">
            <label className="radio-inline">
              <input type="radio" name="gender" value="Male"
                checked={formData.gender === "Male"}
                onChange={() => handleGenderChange(true)}
                disabled={!isEditing} />
              Nam
            </label>
            <label className="radio-inline">
              <input type="radio" name="gender" value="Female"
                checked={formData.gender === "Female"}
                onChange={() => handleGenderChange(false)}
                disabled={!isEditing} />
              Nữ
            </label>
          </div> */}

          <label htmlFor="roles">Cấp quyền màn hình</label>
          <div className="card flex justify-content-center">
            <MultiSelect
              disabled={!isEditing}
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

          {/* <label htmlFor="roles">Chức Vụ</label>
          <div className="checkbox-container">
            {Object.keys(rolesMapping).map(key => (
              <div className="form-check" key={key}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`check${key}`}
                  checked={roles.includes(key)}
                  onChange={handleCheck}
                  disabled={!isEditing || (checkedCount >= 2 && !roles.includes(key))}
                />
                <label className="form-check-label" htmlFor={`check${key}`}>
                  {rolesMapping[key]}
                </label>
              </div>
            ))}
          </div> */}


          <label for="exampleFormControlInput1">Ngày tạo</label>
          <input id="registered" name="registered" class="form-control" type="date" value={user.registered}
            readOnly />
        </div>

      </Modal.Body>
      <Modal.Footer>
        <div className="footer-container">
          <div className="form-check form-switch" >
            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={isEditing} onChange={handleEditToggle} />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Chỉnh Sửa</label>
          </div>
          <div className="footer-buttons">

            <Button className='custom-badge-success' variant="secondary" disabled={!isEditing} onClick={handleSave}>
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

export default UserModal;
