import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getInfo, logout, unsetUser } from 'store/slice/userSlice';
import logo from 'logo.svg';

export default function Mypage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    async function getList() {
      const res = await dispatch(getInfo());
      setUserInfo(res.payload);
    }
    getList();
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(unsetUser());
    sessionStorage.removeItem('TTT_login', 'login');
    navigate('/');
  };

  return (
    <div className='myPageBox roundedRectangle darkModeElement'>
      <img src={logo} alt='logo' />
      <div className='mypageUserInfo'>
        <div>{userInfo.userEmail}</div>
        <div>{userInfo.userNick}</div>
        <div>{userInfo.point} POINT</div>
        <div>{userInfo.userInfo}</div>
      </div>
      <button className='btnElement' onClick={logoutHandler}>
        LOGOUT
      </button>
    </div>
  );
}
