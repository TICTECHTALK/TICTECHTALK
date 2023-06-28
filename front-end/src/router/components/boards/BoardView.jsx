import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  boardDelete,
  boardUpdate,
  boardView,
  saveBookmark,
} from 'store/slice/boardSlice';

export default function BoardView() {
  const userNo = useSelector((state) => state.user.userNo);
  const [category, setCategory] = useState('');
  const [forum, setForum] = useState({});
  const { postNo } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await dispatch(boardView(postNo));
      setForum(res.payload);
      const categoryNo = res.payload.category;
      switch (categoryNo) {
        case 1:
          setCategory('forum');
          break;
        case 2:
          setCategory('qna');
          break;
        case 3:
          setCategory('reference');
          break;
        default:
          alert('정상적이지 않은 경로의 접근입니다.');
          break;
      }
    };

    fetchPost();
  }, [postNo]);

  const handleDeleteClick = async () => {
    const res = await dispatch(boardDelete(forum.postNo));
    console.log(res.payload);
    if (res.payload === '게시물이 삭제되었습니다.')
      navigate(`/boards/${category}`);
  };

  const handleBookmarkClick = async () => {
    const res = await dispatch(saveBookmark(forum.postNo));
    console.log(res);
    if (res.payload.bookmarkId) alert('북마크에 저장되었습니다.');
    else alert('북마크가 삭제되었습니다.');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다.');
  };

  return (
    <>
      <div className='boardViewBox roundedRectangle darkModeElement'>
        <div className='boardInfo'>
          <div className='boardProfile'>{forum.userNick}</div>
          <div>{new Date(forum.postDate).toLocaleDateString()}</div>
          <div>{forum.views} view</div>
        </div>
        <div className='boardViewTitle'>
          <h1>{forum.title}</h1>
        </div>
        <div className='quoteLink'>
          참고링크 :{' '}
          <a
            href={`http://${forum.link}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            {forum.link}
          </a>
        </div>
        <div className='boardViewContent'>{forum.content}</div>
        <div className='boardViewImg'>
          {!forum.storedFileName ? (
            ''
          ) : (
            <img
              src={`/upload/${forum.storedFileName}`}
              height='200'
              alt='Board Image'
            />
          )}
        </div>
        <div className='btnBox'>
          <button className='listBtn btnElement'>
            <Link to={`/boards/${category}`}>LIST</Link>
          </button>
          {userNo === forum.userNo ? (
            <>
              <Link to='/boards/update' state={forum}>
                <button className='updateBtn btnElement'>UPDATE</button>
              </Link>
              <button
                className='deleteBtn btnElement'
                onClick={handleDeleteClick}
              >
                DELETE
              </button>
            </>
          ) : (
            ''
          )}
          <button
            className='bookMarkBtn btnElement'
            onClick={handleBookmarkClick}
          >
            💾
          </button>
          <button className='shareBtn btnElement' onClick={handleCopyLink}>
            🔗
          </button>
        </div>
      </div>
    </>
  );
}
