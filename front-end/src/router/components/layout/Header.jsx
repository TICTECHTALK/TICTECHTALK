import {Link, useNavigate} from 'react-router-dom';
import logo from 'logo.svg';
import {useState} from "react";

export default function Header() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');

  ////////////다크모드////////////
  // setCookie('쿠키', '쿠키테스트');
  sessionStorage.setItem('theme', 'light');
  const darkMode = () => {
    const theme = sessionStorage.getItem('theme');
    if (theme === 'light') {
      document.querySelector('body').setAttribute('data-theme', 'dark');
      sessionStorage.setItem('theme', 'dark');
    } else if (theme === 'dark') {
      document.querySelector('body').removeAttribute('data-theme');
      sessionStorage.setItem('theme', 'light');
    }
  };
  ////////////다크모드////////////


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

  ///////검색///////
  const handleSearchInputChange = (event) => {
    setSearchKeyword(event.target.value);
  }



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
          <Link to='/boards/forum' onClick={handleBoardLinkClick}>FORUM</Link>
        </div>
        <div>
          <Link to='/boards/qna' onClick={handleBoardLinkClick}>QNA</Link>
        </div>
        <div>
          <Link to='/boards/reference' onClick={handleBoardLinkClick}>REFERENCE</Link>
        </div>
        <div>
          <Link to='/chat/create' onClick={handleBoardLinkClick}>CHAT</Link>
        </div>
        <input
          type='text'
          className='searchTap darkModeElement'
          name='searchKeyword'
          placeholder='search'
        />
        <label className='toggle' htmlFor='togleBtn'>
          <input
            className='togleBtn darkModeElement'
            type='checkbox'
            onClick={darkMode}
            value={se}
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
          {localStorage.getItem('accessToken') ? '😎' : '🔑'}
        </div>
        {/* </Link> */}
      </header>
    </>
  );
}
