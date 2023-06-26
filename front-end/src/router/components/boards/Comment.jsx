import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cmDelete, cmWrite, getCmList } from 'store/slice/commentSlice';
import { useForm } from 'react-hook-form';
import SingleComment from './SingleComment';

export default function Comment() {
  const { postNo } = useParams();
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [likedComments, setLikedComments] = useState([]);
  const [showRecm, setShowRecm] = useState(false);

  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();

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
    reset('cmContent');
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLikeComment = async (cmId) => {
    // try {
    //   if (likedComments.includes(cmId)) {
    //     // 이미 좋아요를 누른 경우, 싫어요로 변경
    //     await Instance.post(`/comments/${cmId}/disLike`); // 싫어요 API 경로로 변경해야 합니다.
    //     // 상태 업데이트: 해당 댓글의 상태를 dislike로 변경
    //     setLikedComments(likedComments.filter((id) => id !== cmId));
    //   } else {
    //     // 좋아요 처리
    //     await Instance.post(`/comments/${cmId}/like`); // 좋아요 API 경로로 변경해야 합니다.
    //     // 상태 업데이트: 해당 댓글의 상태를 like로 변경
    //     setLikedComments([...likedComments, cmId]);
    //   }
    //   fetchComments(currentPage); // 댓글 목록 업데이트
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <>
      <div className='commentBox roundedRectangle darkModeElement'>
        {comments.length > 0 &&
          comments.map((comment) => (
            <SingleComment comment={comment} key={comment.cmId} />
          ))}
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
      </div>
    </>
  );
}
