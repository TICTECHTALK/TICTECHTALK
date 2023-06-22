import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteUser, logout, unsetUser } from 'store/slice/userSlice';

export default function Mypage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(unsetUser());
    sessionStorage.removeItemItem('TTT_login', 'login');
    navigate('/');
  };

  const deleteHandler = () => {
    dispatch(deleteUser());
  };
  return (
    <div className='myPageBox roundedRectangle darkModeElement'>
      <div className='myPageProfile'></div>
      <div className='mypageUserInfo'>
        <div>abcde@gmail.com</div>
        <div>김블랙맘바</div>
        <div>123 point</div>
        <div>안녕하세요 동에번쩍 서에번쩍 김블랙맘바입니다!</div>
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
