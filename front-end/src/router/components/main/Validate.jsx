import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getNewestList } from 'store/slice/boardSlice';
import { logout } from 'store/slice/userSlice';
import { getCookie } from 'util/Cookie';

export default function Validate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (localStorage.getItem('accessToken') || getCookie('refreshToken')) {
    dispatch(logout());
    navigate('/main');
  }

  const [postList, setPostList] = useState([]);
  const [currentNo, setCurrentNo] = useState(0); // 10개를 4개씩 띄움 : 0 ~ 6
  const [totalPost, setTotalPost] = useState(0);

  const getMain = async () => {
    const res = await dispatch(getNewestList());
    setPostList(res.payload.content);
    setTotalPost(res.payload.content.length);
  };

  useEffect(() => {
    getMain();
  }, [currentNo]);

  const mainPhrase = 'You Can Do It When You Tic Tech Talk It.';
  const [typingText, setTypingText] = useState('');
  const [typingCount, setTypingCount] = useState(0);

  useEffect(() => {
    const typing = setInterval(async () => {
      await setTypingText(typingText + mainPhrase[typingCount]);
      await setTypingCount(typingCount + 1);
      if (mainPhrase.length === typingCount) {
        setTypingText('');
        setTypingCount(0);
        setTimeout(() => {}, 2000);
      }
    }, 200);
    return () => clearInterval(typing);
  });

  const prevBtn = () => {
    if (currentNo === 0) return;
    setCurrentNo(currentNo - 1);
  };

  const nextBtn = () => {
    if (currentNo === 6) return;
    setCurrentNo(currentNo + 1);
  };

  return (
    <>
      <div className='mainBoards'>
        <div className='mainImage'>
          <div className='mainPhrase'>{typingText}</div>
        </div>
        <div className='mainPhrase'>
          지금 개발자들은 어떤 생각을 하고 있을까요?
        </div>
        <div className='cardWrap'>
          <div className='cardBtn' onClick={prevBtn}>
            #
          </div>
          <div className='mainCards'>
            <div
              className='cardSlide'
              style={{
                transform: `translateX(${-220 * currentNo}px)`,
              }}
            >
              {postList.map((post) => (
                <Link to={`/boards/${post.postNo}`}>
                  <div
                    className='card darkModeElement roundedRectangle'
                    key={post.postNo}
                  >
                    <div className='userNick'>{post.userNick}</div>
                    <div className='title'>{post.title}</div>
                    <div className='postDate'>
                      {post.postDate.split('T')[0]}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className='cardBtn' onClick={nextBtn}>
            #
          </div>
        </div>
      </div>
    </>
  );
}
