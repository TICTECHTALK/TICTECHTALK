import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { boardUpdate } from 'store/slice/boardSlice';

export default function BoardUpdate() {
  const post = useLocation().state;
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch } = useForm();
  const [imagePreview, setImagePreview] = useState('');
  const [fileName, setFileName] = useState(post.storedFileName);
  const dispatch = useDispatch();

  const file = watch('boardFile')?.[0].name;

  useEffect(() => {
    if (file) {
      setFileName(file);
    }
  }, [file]);

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
          />
        </div>
        <button type='submit' className='btnElement'>
          UPDATE
        </button>
      </form>
    </div>
  );
}
