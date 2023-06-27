import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  cmDelete,
  cmLike,
  cmLikey,
  getRecmList,
} from 'store/slice/commentSlice';
import Recomment from './Recomment';
import RecommentInput from './RecommentInput';

export default function SingleComment({ comment, getComments }) {
  const [showRecm, setShowRecm] = useState(false);
  const [recomments, setRecomments] = useState([]);
  const [totalLikeNum, setTotalLikeNum] = useState(comment.totalLikeNum);
  const [likey, setLikey] = useState();
  const userNo = useSelector((state) => state.user.userNo);
  const dispatch = useDispatch();

  const getRecomments = async () => {
    const res = await dispatch(getRecmList(comment.cmId));
    if (res.payload.length !== 0) {
      setRecomments(res.payload);
    }
  };

  const getLikey = async () => {
    const res = await dispatch(cmLikey({ userNo: userNo, cmId: comment.cmId }));
    if (res.payload) setLikey(true);
  };

  useEffect(() => {
    getRecomments();
    getLikey();
  }, []);

  const cmReplyHandler = async (cmId) => {
    setShowRecm(!showRecm);
  };

  const cmDeleteHandler = async (cmId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      const res = await dispatch(cmDelete(cmId));
      getComments();
    } else {
      return;
    }
  };

  const handleLikey = async (cmId) => {
    const res = await dispatch(cmLike(cmId));
    if (
      likey
        ? setTotalLikeNum(totalLikeNum - 1)
        : setTotalLikeNum(totalLikeNum + 1)
    );
    setLikey(!likey);
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
                handleLikey(comment.cmId);
              }}
            >
              {likey ? '❤️' : '🤍'}
              {totalLikeNum}
            </button>
          </div>
        </div>
        <div className='cmContent'>{comment.cmContent}</div>
      </div>
      {recomments.length > 0 &&
        recomments.map((recomment) => (
          <Recomment
            recomment={recomment}
            getRecomments={getRecomments}
            key={`recomment${recomment.recmId}`}
          />
        ))}
      {showRecm ? (
        <RecommentInput
          cmId={comment.cmId}
          getRecomments={getRecomments}
          setShowRecm={setShowRecm}
        />
      ) : (
        ''
      )}
    </>
  );
}
