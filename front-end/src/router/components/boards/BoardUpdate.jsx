import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Instance from '../../../util/axiosConfig';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { boardUpdate } from 'store/slice/boardSlice';

export default function BoardUpdate() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [imagePreview, setImagePreview] = useState('');
  const [fileName, setFileName] = useState('파일 없음');
  const dispatch = useDispatch();
  const post = useLocation().state;

  useEffect(() => {
    Object.keys(post).forEach((key) => {
      setValue(key, post[key]);
    });

    if (post.storedFileName !== null) {
      setImagePreview(`/upload/${post.storedFileName}`);
    }
  }, [post.postNo]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('postNo', post.postNo);
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('content', data.content);
    formData.append('link', data.link);
    formData.append('storedFileName', data.storedFileName);
    if (data.boardFile && data.boardFile.length > 0) {
      formData.append('boardFile', data.boardFile[0]);
    }

    const res = await dispatch(boardUpdate(formData));
    console.log(res);
    alert('글 수정이 완료되었습니다.');
    navigate(`/boards/${res.payload}`);
  };

  const handleImageDelete = () => {
    setImagePreview('');
    setValue('storedFileName', null);
    setValue('originalFileName', null);
  };

  return (
    <div className='boardWriteBox roundedRectangle darkModeElement'>
      <form className='boardWriteForm' onSubmit={handleSubmit(onSubmit)}>
        <input
          type='text'
          name='category'
          className='hideElement'
          {...register('category')}
          readOnly
        />
        <input
          className='darkModeElement'
          type='text'
          name='title'
          {...register('title', { required: true })}
        />
        <textarea
          className='darkModeElement'
          name='content'
          cols='30'
          rows='30'
          {...register('content', { required: true })}
        ></textarea>
        <input
          className='darkModeElement'
          type='text'
          name='link'
          placeholder='참고 링크를 입력하세요.'
          {...register('link')}
        />
        {imagePreview && (
          <div className='boardViewImg'>
            <img
              src={imagePreview}
              height='200'
              alt='Board Image'
              style={{ width: '150px', objectFit: 'contain' }}
            />
            <button onClick={handleImageDelete}>❌</button>
          </div>
        )}
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
            onChange={(e) =>
              e.target.files && setFileName(e.target.files[0].name)
            }
          />
        </div>
        <button type='submit' className='btnElement'>
          UPDATE
        </button>
      </form>
    </div>
  );
}
