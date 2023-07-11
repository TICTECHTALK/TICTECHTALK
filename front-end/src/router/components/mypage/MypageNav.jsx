import { NavLink } from 'react-router-dom';

export default function MypageNav() {
  return (
    <div className='myPageNav'>
      <NavLink
        to='/mypage/update'
        className={({ isActive }) =>
          isActive ? 'darkModeElement' : 'unselected'
        }
      >
        MYPAGE
      </NavLink>
      <NavLink
        to='/mypage/bookmark'
        className={({ isActive }) =>
          isActive ? 'darkModeElement' : 'unselected'
        }
      >
        BOOKMARK
      </NavLink>
      <NavLink
        to='/mypage/mypost'
        className={({ isActive }) =>
          isActive ? 'darkModeElement' : 'unselected'
        }
      >
        MYPOST
      </NavLink>
    </div>
  );
}
