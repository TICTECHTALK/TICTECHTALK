export default function Main() {
  return (
    <>
      <div className='mainBoards'>
        <div
          className='mainboard roundedRectangle darkModeElement'
          id='mainForum'
        >
          <div>글쓴이</div>
          <div>제목</div>
          <div>조회수</div>
          <div>내용</div>
          <div>댓글수</div>
        </div>
        <div
          className='mainboard roundedRectangle darkModeElement'
          id='mainQNA'
        >
          mainQNA
        </div>
        <div
          className='mainboard roundedRectangle darkModeElement'
          id='mainReference'
        >
          mainReference
        </div>
      </div>
    </>
  );
}
