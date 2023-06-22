import { useLocation } from 'react-router-dom';

export default function BoardWrite() {
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
  return (
    <div className='boardWriteBox roundedRectangle darkModeElement'>
      <form className='boardWriteForm'>
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
        />
        <textarea
          className='darkModeElement'
          name='content'
          cols='30'
          rows='30'
        ></textarea>
        <input
          className='darkModeElement'
          type='text'
          name='link'
          placeholder='참고링크를 입력하세요.'
        />
        <button type='submit' className='btnElement'>
          WRITE
        </button>
      </form>
    </div>
  );
}
