import { Link } from 'react-router-dom';
import github from 'github.png';

export default function Header() {
  return (
    <>
      <footer>
        <Link to='https://github.com/TICTECHTALK/TICTECHTALK'>
          <div className='contactUs'>
            <img src={github} />
            github.com/TICTECHTALK/TICTECHTALK
          </div>
        </Link>
        <div className='copyright'>
          Copyright © TicTechTalk All Rights Reserved.
        </div>
      </footer>
    </>
  );
}
