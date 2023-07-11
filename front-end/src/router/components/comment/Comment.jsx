import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cmWrite, getCmList } from 'store/slice/commentSlice';
import SingleComment from './SingleComment';
import { useForm } from 'react-hook-form';

export default function Comment() {
  const { postNo } = useParams();
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const dispatch = useDispatch();
  const { register, handleSubmit, resetField } = useForm();

  const getComments = async () => {
    const res = await dispatch(
      getCmList({ page: currentPage, postNo: postNo })
    );
    if (res.payload) {
      setComments(res.payload.content);
      setTotalPages(res.payload.totalPages);
    }
  };

  useEffect(() => {
    //댓글 목록 가져오기
    getComments();
  }, [currentPage, postNo, dispatch]);

  const cmWriteHanlder = async (data) => {
    await dispatch(cmWrite({ cmContent: data.cmContent, postNo: postNo }));
    resetField('cmContent');
    getComments();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className='commentBox roundedRectangle darkModeElement'>
        {comments.length > 0 &&
          comments.map((comment) => (
            <SingleComment
              getComments={getComments}
              comment={comment}
              key={comment.cmId}
            />
          ))}
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
              placeholder='댓글을 입력해주세요!'
              {...register('cmContent')}
            ></textarea>
            <button type='submit' className='btnElement'>
              COMMENT
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
