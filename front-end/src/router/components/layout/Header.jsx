import { Link, useNavigate } from 'react-router-dom';
import logo from 'logo.svg';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Header() {
  const navigate = useNavigate();
  const { register, handleSubmit, resetField } = useForm();
  const userNo = useSelector((state) => state.user.userNo);

  const [theme, setTheme] = useState('light');

  const darkMode = () => {
    // const theme = sessionStorage.getItem('theme');
    if (theme === 'light') {
      document.querySelector('body').setAttribute('data-theme', 'dark');
      // sessionStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else if (theme === 'dark') {
      document.querySelector('body').removeAttribute('data-theme');
      // sessionStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  useEffect(() => {
    ////////////다크모드////////////
    // sessionStorage.setItem('theme', 'light');
    ////////////다크모드////////////
  }, [theme]);

  const handleBoardLinkClick = (event) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      // 토큰이 없는 경우 알림창 띄우기
      alert('로그인이 필요합니다.');
      event.preventDefault();
    } else {
      // 토큰이 있는 경우 페이지 이동
      navigate('/boards/forum' || '/boards/qna' || '/boards/reference');
    }
  };

  const handleSearch = (data) => {
    resetField('searchKeyword');
    navigate('/boards/search', { state: data.searchKeyword });
  };

  /////////////////
  return (
    <>
      <header>
        <div className='logo'>
          <Link to='/'>
            <img src={logo} alt='logo' />
          </Link>
        </div>
        <div>
          <Link to='/boards/forum' onClick={handleBoardLinkClick}>
            FORUM
          </Link>
        </div>
        <div>
          <Link to='/boards/qna' onClick={handleBoardLinkClick}>
            QNA
          </Link>
        </div>
        <div>
          <Link to='/boards/reference' onClick={handleBoardLinkClick}>
            REFERENCE
          </Link>
        </div>
        <div>
          <Link to='/chat' onClick={handleBoardLinkClick}>
            CHAT
          </Link>
        </div>
        <form onSubmit={handleSubmit(handleSearch)}>
          <input
            type='text'
            className='searchTap darkModeElement'
            name='searchKeyword'
            placeholder='🔎search'
            {...register('searchKeyword', { required: true })}
          />
        </form>
        <label className='toggle' htmlFor='togleBtn'>
          <input
            className='togleBtn darkModeElement'
            type='checkbox'
            onClick={darkMode}
          />
        </label>
        {/* ⬇️액세스 토큰이 있으면 mypage, 없으면 login으로 이동 */}
        <div
          className='userBtn'
          onClick={() => {
            localStorage.getItem('accessToken')
              ? navigate('/mypage')
              : navigate('/login');
          }}
        >
          {userNo !== 0 ? '😎' : '🔑'}
        </div>
        {/* </Link> */}
      </header>
    </>
  );
}
