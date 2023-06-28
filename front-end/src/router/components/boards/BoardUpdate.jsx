import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Instance from '../../../util/axiosConfig';
import { useEffect, useState } from 'react';

export default function BoardUpdate() {
  const { postNo } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [imagePreview, setImagePreview] = useState('');
  const [fileName, setFileName] = useState('파일 없음');

  useEffect(() => {
    Instance.get(`/boards/update/${postNo}`)
      .then((response) => {
        const data = response.data;
        Object.keys(data).forEach((key) => {
          setValue(key, data[key]);
        });

        if (data.storedFileName != null) {
          setImagePreview(`/upload/${data.storedFileName}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [postNo]);

  const onSubmit = (data) => {
    const formData = new FormData();
    console.log(data);
    formData.append('postNo', postNo);
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('content', data.content);
    formData.append('link', data.link);
    formData.append('storedFileName', data.storedFileName);
    if (data.boardFile && data.boardFile.length > 0) {
      formData.append('boardFile', data.boardFile[0]);
    }

    Instance.post(`/boards/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log(response.data);
        const data = response.data;
        alert('글 수정이 완료되었습니다.');
        navigate(`/boards/${data}`);
      })
      .catch((error) => {
        console.error(error);
      });
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
            <img src={imagePreview} height='200' alt='Board Image' />
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
