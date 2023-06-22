import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteUser, getInfo, logout, unsetUser } from 'store/slice/userSlice';

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

  const deleteHandler = () => {
    dispatch(deleteUser());
  };
  return (
    <div className='myPageBox roundedRectangle darkModeElement'>
      <div className='myPageProfile'></div>
      <div className='mypageUserInfo'>
        <div>{userInfo.userEmail}</div>
        <div>{userInfo.userNick}</div>
        <div>{userInfo.point} POINT</div>
        <div>{userInfo.userInfo}</div>
      </div>
      <button className='btnElement'>
        <Link to='/mypage/update'>프로필 수정하기</Link>
      </button>
      <button className='btnElement' onClick={logoutHandler}>
        LOGOUT
      </button>
      <button className='btnElement' onClick={deleteHandler}>
        DELETE
      </button>
    </div>
  );
}
