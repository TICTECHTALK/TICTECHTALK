import { useLocation } from 'react-router-dom';
import {useForm} from "react-hook-form";
import Instance from "../../../util/axiosConfig";
import {useState} from "react";

export default function BoardWrite() {
  const {register, handleSubmit} = useForm();
  const [message, setMessage] = useState('');

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
  console.log(categoryNo);
  const onSubmit = (data) => {

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("category", categoryNo);
    formData.append("content", data.content);
    formData.append("link", data.link);
    formData.append("boardFile", data.boardFileoardFile);


    Instance.post("/boards/write", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
      })
        .then(response => {
          console.log(response);
          const postNo = response.data; // postNo 값 받기
          console.log(postNo);
          if (postNo !== undefined) { // postNo 값이 정의되어 있는지 확인
            window.location.href = `/boards/${postNo}`; // 해당 postNo로 페이지 이동
          } else {
            console.error("postNo 값이 유효하지 않습니다.");
          }
        })
        .catch(error => {
          if (error.response) {
            console.log("error: ", error.response);
          } else {
            console.log("error: ", error);
          }
        })

  };

  return (
    <div className='boardWriteBox roundedRectangle darkModeElement'>
      <form className='boardWriteForm' onSubmit={handleSubmit(onSubmit)}>
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
          {...register("title")}
        />
        <textarea
          className='darkModeElement'
          name='content'
          cols='30'
          rows='30'
          {...register("content")}
        ></textarea>
        <input
            className='darkModeElement'
            type='text'
            name='link'
            placeholder='참고링크를 입력하세요.'
            {...register("link")}
        />
        <input
            className='darkModeElement'
            type='file'
            name='boardFile'
            {...register("boardFile")}
        />
        <button type='submit' className='btnElement'>
          WRITE
        </button>
      </form>
    </div>
  );
}
