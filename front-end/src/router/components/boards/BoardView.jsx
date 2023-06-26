import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { boardDelete, boardUpdate, boardView } from 'store/slice/boardSlice';

export default function BoardView() {
  const [forum, setForum] = useState({});
  const { postNo } = useParams();
  ////////////////////
  const navigate = useNavigate();
  ////////////////////
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await dispatch(boardView(postNo));
      console.log(res);
      setForum(res.payload);
    };

    fetchPost();
  }, [postNo]);

  const handleUpdateClick = async () => {
    const res = await dispatch(boardUpdate(forum.postNo));
    console.log(res.payload);
    navigate(`/boards/update/${res.payload.postNo}`);
  };

  const handleDeleteClick = async () => {
    const res = await dispatch(boardDelete(forum.postNo));
    console.log(res.payload);
    if (res.payload === '게시물이 삭제되었습니다.') navigate('/');
  };

  return (
    <>
      <div className='boardViewBox roundedRectangle darkModeElement'>
        <div className='boardInfo'>
          <div className='boardProfile'>
            <div className='boardprofileImg'></div>
            {forum.userNick}
          </div>
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
          {forum.storedFileName && (
            <img src={`/upload/${forum.storedFileName}`} height='200' />
          )}
        </div>
        <div className='btnBox'>
          <button className='listBtn btnElement'>
            <Link to='/boards/forum'>LIST</Link>
          </button>
          <button className='updateBtn btnElement' onClick={handleUpdateClick}>
            UPDATE
          </button>
          <button className='deleteBtn btnElement' onClick={handleDeleteClick}>
            DELETE
          </button>
          <button className='bookMarkBtn btnElement'>📥</button>
          <button className='shareBtn btnElement'>🔗</button>
        </div>
      </div>
    </>
  );
}
