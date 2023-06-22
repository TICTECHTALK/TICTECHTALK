export default function Board() {
  return (
    <>
      <div className='commentBox roundedRectangle darkModeElement'>
        <div className='comment'>
          <div className='cmUpper'>
            <div className='cmInfo'>
              <div className='boardprofileImg'></div>
              <div className='cmName'>최정혜</div>
              <div className='cmDate'>2023-06-07 22:27:15</div>
            </div>
            <div className='cmBtn'>
              <button className='cmDelete'>🗑️</button>
              <button className='cmDelete'>↪️</button>
              <button className='cmLikey'>❤️</button>
            </div>
          </div>
          <div className='cmContent'>회원가입로그인하기</div>
        </div>
        <div className='comment replyCm'>
          <div className='cmUpper'>
            <div className='cmInfo'>
              ↪️
              <div className='boardprofileImg'></div>
              <div className='cmName'>김은별</div>
              <div className='cmDate'>2023-06-07 22:47:49</div>
            </div>
            <div className='cmBtn'>
              <button className='cmDelete'>🗑️</button>
              <button className='cmReply'>↪️</button>
              <button className='cmLikey'>❤️</button>
            </div>
          </div>
          <div className='cmContent'>백슉먹자했짜나!</div>
        </div>
        <div className='cmPage'>{'< 1 2 3 4 5 >'}</div>
        <div className='cmWriteBox'>
          <form className='cmWriteForm'>
            <textarea
              className='darkModeElement'
              placeholder='모니터 뒤에 사람있어요'
            ></textarea>
            <button type='submit' className='btnElement'>
              WRITE
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
