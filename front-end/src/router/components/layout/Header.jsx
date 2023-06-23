import {Link, useLocation, useNavigate} from 'react-router-dom';
import logo from 'logo.svg';

export default function Header() {
  const navigate = useNavigate();

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

  return (
    <>
      <header>
        <div className='logo'>
          <Link to='/'>
            <img src={logo} alt='logo' />
          </Link>
        </div>
        <div>
          <Link to='/boards/forum'>FORUM</Link>
        </div>
        <div>
          <Link to='/boards/qna'>QNA</Link>
        </div>
        <div>
          <Link to='/boards/reference'>REFERENCE</Link>
        </div>
        <div>
          <Link to='/chat/create'>CHAT</Link>
        </div>
        <input
          type='text'
          className='searchTap darkModeElement'
          placeholder='search'
        />
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
          {localStorage.getItem('accessToken') ? '😎' : '🔑'}
        </div>
        {/* </Link> */}
      </header>
    </>
  );
}
