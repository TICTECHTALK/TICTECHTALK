import { Link } from 'react-router-dom';

export default function MypageNav() {
  return (
    <div className='myPageNav'>
      <div className='mypage darkModeElement'>
        <Link to='/mypage'>MYPAGE</Link>
      </div>
      <div className='bookmark unselected'>
        <Link to='/mypage/bookmark'>BOOKMARK</Link>
      </div>
      <div className='mypost unselected'>
        <Link to='/mypage/mypost'>MYPOST</Link>
      </div>
    </div>
  );
}
