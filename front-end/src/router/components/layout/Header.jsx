import { Link, useNavigate } from 'react-router-dom';
import logo from 'logo.svg';
import { useState } from 'react';
import Instance from "../../../util/axiosConfig";

export default function Header() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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
  };

  // const handleSearchSubmit = (event) => {
  //   event.preventDefault();
  //   Instance.get(`/boards/search?searchKeyword=${searchKeyword}`)
  //       .then((response)=>{
  //         console.log(response);
  //         // navigate(`/boards/search?searchKeyword=${searchKeyword}&page=${page}`)
  //       })
  //       .catch((error)=>{
  //         console.log(error);
  //       })
  // };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    params.append('searchKeyword', searchKeyword);
    params.append('page', currentPage);

    Instance.post(`/boards/search?${params.toString()}`)
        .then((response) => {
          console.log(response);
          navigate(`/boards/search?${params.toString()}`);
        })
        .catch((error) => {
          console.log(error);
        });
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
        <form onSubmit={handleSearchSubmit}>
          <input
            type='text'
            className='searchTap darkModeElement'
            name='searchKeyword'
            placeholder='🔎search'
            onChange={handleSearchInputChange}
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
          {localStorage.getItem('accessToken') ? '😎' : '🔑'}
        </div>
        {/* </Link> */}
      </header>
    </>
  );
}
