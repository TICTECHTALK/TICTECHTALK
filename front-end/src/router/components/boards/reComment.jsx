import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRecmList, recmDelete } from 'store/slice/commentSlice';

export default function Recomment({ cmId }) {
  const userNo = useSelector((state) => state.user.userNo);
  const [recomments, setRecomments] = useState([]);
  const dispatch = useDispatch();

  const getRecomments = async () => {
    const res = await dispatch(getRecmList(cmId));
    if (res.payload.length !== 0) {
      setRecomments(res.payload);
    }
  };

  useEffect(() => {
    //댓글 목록 가져오기
    getRecomments();
  }, []);

  const cmDeleteHandler = async (cmId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      const res = await dispatch(recmDelete(cmId));
      getRecomments();
    } else {
      return;
    }
  };

  return (
    <>
      {recomments.length > 0 &&
        recomments.map((recomment) => (
          <div className='comment replyCm' key={`${recomment.recmId}`}>
            <div className='cmUpper'>
              <div className='cmInfo'>
                <div className='boardprofileImg'></div>
                <div className='cmName'>{recomment.userNick}</div>
                <div className='cmDate'>{recomment.recmDate}</div>
              </div>
              <div className='cmBtn'>
                {userNo === recomment.userNo ? (
                  <button
                    className='cmDelete'
                    onClick={() => cmDeleteHandler(recomment.recmId)}
                  >
                    🗑️
                  </button>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className='cmContent'>{recomment.recmContent}</div>
          </div>
        ))}
    </>
  );
}
