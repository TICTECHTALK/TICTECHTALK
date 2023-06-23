import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  deleteUser,
  getInfo,
  unsetUser,
  updateInfo,
} from 'store/slice/userSlice';
import logo from 'logo.svg';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import mypage from 'style/mypage.css';

export default function MypageUpdate() {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({});
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    async function getList() {
      const res = await dispatch(getInfo());
      setUserInfo(res.payload);
    }
    getList();
  }, []);

  const infoUpdateHandler = async (data) => {
    const res = await dispatch(updateInfo(data));
    if (res.payload.userEmail) navigate('/mypage');
  };

  const deleteHandler = () => {
    dispatch(deleteUser());
    dispatch(unsetUser());
    sessionStorage.removeItem('TTT_login', 'login');
    navigate('/');
  };

  return (
    <div className='myPageBox roundedRectangle darkModeElement'>
      <img src={logo} alt='logo' />
      <div className='profileInfo'>{userInfo.userEmail}</div>
      <div className='profileInfo'>{userInfo.point} POINT</div>
      <form onSubmit={handleSubmit(infoUpdateHandler)}>
        <input
          defaultValue={userInfo.userNick}
          className='darkModeElement'
          placeholder='닉네임을 변경해주세요!'
          {...register('userNick', { required: true })}
        />
        <textarea
          className='darkModeElement'
          defaultValue={userInfo.userInfo}
          placeholder='자기소개를 적어주세요!🫥'
          {...register('userInfo')}
        ></textarea>
        <button className='btnElement' type='submit'>
          프로필 수정
        </button>
      </form>
      <button
        className='btnElement'
        onClick={deleteHandler}
        style={{ backgroundColor: '#8a8a8a' }}
      >
        회원탈퇴
      </button>
    </div>
  );
}
