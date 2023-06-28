import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Instance from '../../../util/axiosConfig';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { boardWrite } from 'store/slice/boardSlice';

export default function BoardWrite() {
  const { register, handleSubmit, watch } = useForm();
  const [fileName, setFileName] = useState('파일 없음');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const file = watch('boardFile')?.[0].name
    ? watch('boardFile')[0].name
    : '파일 없음';
  useEffect(() => {
    setFileName(file);
  }, [file]);

  const category = useLocation().state.categoryName;
  let categoryNo;
  switch (category) {
    case 'forum':
      categoryNo = 1;
      break;
    case 'qna':
      categoryNo = 2;
      break;
    case 'reference':
      categoryNo = 3;
      break;
    default:
      alert('정상적이지 않은 경로의 접근입니다.');
      break;
  }

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('category', categoryNo);
    formData.append('content', data.content);
    formData.append('link', data.link);
    if (data.boardFile && data.boardFile.length > 0) {
      // 파일이 선택된 경우에만 추가
      formData.append('boardFile', data.boardFile[0]);
    }

    const res = await dispatch(boardWrite(formData));
    if (res.payload) navigate(`/boards/${res.payload}`);
  };

  return (
    <div className='boardWriteBox roundedRectangle darkModeElement'>
      <form
        className='boardWriteForm'
        onSubmit={handleSubmit(onSubmit)}
        encType='multipart/form-data'
      >
        <input
          type='text'
          name='category'
          className='hideElement'
          defaultValue={categoryNo}
          readOnly
        />
        <input
          className='darkModeElement'
          type='text'
          name='title'
          placeholder='제목을 입력하세요.'
          {...register('title')}
        />
        <textarea
          className='darkModeElement'
          name='content'
          cols='30'
          rows='30'
          {...register('content')}
        ></textarea>
        <input
          className='darkModeElement'
          type='text'
          name='link'
          placeholder='참고링크를 입력하세요.'
          {...register('link')}
        />
        <div className='inputFile'>
          <label htmlFor='boardFile' className='inputFileLabel'>
            파일찾기
          </label>
          <div className='inputFileName'>{fileName}</div>
          <input
            id='boardFile'
            className='darkModeElement hideElement'
            type='file'
            name='boardFile'
            {...register('boardFile')}
            // onChange={(e) =>
            //   e.target.files && setFileName(e.target.files[0].name)
            // }
          />
        </div>
        <button type='submit' className='btnElement'>
          WRITE
        </button>
      </form>
    </div>
  );
}
