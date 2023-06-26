import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cmDelete, cmLikey } from 'store/slice/commentSlice';
import Recomment from './Recomment';
import RecommentInput from './RecommentInput';

export default function SingleComment({ comment }) {
  const [likedComments, setLikedComments] = useState([]);
  const [showRecm, setShowRecm] = useState(false);
  const userNo = useSelector((state) => state.user.userNo);
  // console.log('state.userNo', userNo, '/ comment.userNo', comment.userNo);
  const dispatch = useDispatch();

  const getLikey = async () => {
    const res = await dispatch(cmLikey(comment.cmId));
    console.log(res);
  };

  useEffect(() => {
    getLikey();
  }, []);

  const cmLike = async () => {
    const res = await dispatch(cmLike(comment.cmId));
    console.log(res);
  };

  const cmDislike = async () => {
    const res = await dispatch(cmDislike(comment.cmId));
    console.log(res);
  };

  const cmReplyHandler = async (cmId) => {
    setShowRecm(!showRecm);
  };

  const cmDeleteHandler = async (cmId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      const res = await dispatch(cmDelete(cmId));
      // getComments();
    } else {
      return;
    }
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
      <div className='comment' key={`cmId${comment.cmId}`}>
        <div className='cmUpper'>
          <div className='cmInfo'>
            <div className='boardprofileImg'></div>
            <div className='cmName'>{comment.userNick}</div>
            <div className='cmDate'>{comment.cmDate}</div>
          </div>
          <div className='cmBtn'>
            {userNo === comment.userNo ? (
              <button
                className='cmDelete'
                onClick={() => cmDeleteHandler(comment.cmId)}
              >
                🗑️
              </button>
            ) : (
              ''
            )}
            <button
              className='cmReply'
              onClick={() => cmReplyHandler(comment.cmId)}
            >
              ↪️
            </button>
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
      <Recomment cmId={comment.cmId} />
      {showRecm ? <RecommentInput cmId={comment.cmId} /> : ''}
    </>
  );
}
