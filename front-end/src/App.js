import { RouterProvider } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeCookie } from 'util/Cookie';
import { setUser, unsetUser } from 'store/slice/userSlice';
import 'style/style.css';
import router from 'router/router';

function App() {
  //로그인 유지
  const dispatch = useDispatch();
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const decodedAccessToken = jwtDecode(accessToken);
      dispatch(setUser(decodedAccessToken));
    }
    return () => {
      localStorage.removeItem('accessToken');
      removeCookie('refreshToken');
    };
  }, [dispatch]);
  //세션스토리지에 값이 없으면(브라우저 종료 후 실행시) 저장되어있는 로컬스토리지/쿠키 삭제
  if (!sessionStorage.getItem('TTT_login')) {
    dispatch(unsetUser());
    localStorage.removeItem('accessToken');
    removeCookie('refreshToken');
  }
  //로그인 유지&브라우저 닫으면 로그아웃

  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
