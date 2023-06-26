import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cmDelete, cmWrite, getCmList } from 'store/slice/commentSlice';
import { useForm } from 'react-hook-form';

export default function reComment(cmId) {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [likedComments, setLikedComments] = useState([]);

  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const getComments = async () => {
    const res = await dispatch(
      getCmList({ page: currentPage, postNo: postNo })
    );
    if (res.payload) setComments(res.payload.content);
  };

  useEffect(() => {
    //댓글 목록 가져오기
    getComments();
  }, [currentPage, postNo, dispatch]);

  const cmWriteHanlder = async (data) => {
    await dispatch(cmWrite({ cmContent: data.cmContent, postNo: postNo }));
    getComments();
  };

  const cmDeleteHandler = async (cmId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      const res = await dispatch(cmDelete(cmId));
      getComments();
    } else {
      return;
    }
  };

  return (
    <>
      <div className='commentBox roundedRectangle darkModeElement'>
        {comments.length > 0 &&
          comments.map((comment) => (
            <div className='comment' key={comment.cmId}>
              <div className='cmUpper'>
                <div className='cmInfo'>
                  <div className='boardprofileImg'></div>
                  <div className='cmName'>{comment.userNick}</div>
                  <div className='cmDate'>{comment.cmDate}</div>
                </div>
                <div className='cmBtn'>
                  <button
                    className='cmDelete'
                    onClick={() => cmDeleteHandler(comment.cmId)}
                  >
                    🗑️
                  </button>
                  <button className='cmReply'>↪️</button>
                  <button
                    className='cmLikey'
                    onClick={() => {
                      handleLikeComment(comment.cmId);
                    }}
                  >
                    {likedComments.includes(comment.cmId) ? '❤️' : '🤍'}
                    {comment.totalLikeNum}
                  </button>
                </div>
              </div>
              <div className='cmContent'>{comment.cmContent}</div>
            </div>
            // {/*/!* 대댓글 데이터를 동적으로 표시하는 부분 *!/*/}
            // {/*{comment.replies.map((reply) => (*/}
            // {/*    <div className="comment replyCm" key={reply.id}>*/}
            // {/*      <div className="cmUpper">*/}
            // {/*        <div className="cmInfo">↪️</div>*/}
            // {/*        <div className="boardprofileImg"></div>*/}
            // {/*        <div className="cmName">{reply.username}</div>*/}
            // {/*        <div className="cmDate">{reply.createdAt}</div>*/}
            // {/*      </div>*/}
            // {/*      <div className="cmBtn">*/}
            // {/*        <button className="cmDelete">🗑️</button>*/}
            // {/*        <button className="cmReply">↪️</button>*/}
            // {/*        <button className="cmLikey">❤️</button>*/}
            // {/*      </div>*/}
            // {/*      <div className="cmContent">{reply.content}</div>*/}
            // {/*    </div>*/}
            // {/*))}*/}
          ))}
      </div>
      <div className='cmPage'>
        {Array.from({ length: totalPages }, (_, index) => index + 1)
          .filter((page) => Math.abs(page - currentPage) <= 2)
          .map((page) => (
            <button
              key={page}
              className={page === currentPage ? 'active' : ''}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
      </div>
      <div className='cmWriteBox'>
        <form className='cmWriteForm' onSubmit={handleSubmit(cmWriteHanlder)}>
          <textarea
            className='darkModeElement'
            name='cmContent'
            {...register('cmContent')}
          ></textarea>
          <button type='submit' className='btnElement'>
            WRITE
          </button>
        </form>
      </div>
    </>
  );
}
