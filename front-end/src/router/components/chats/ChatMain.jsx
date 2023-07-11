import logo from 'logo.svg';

///////////////////////////////////////////////////////////////////////////////////////////////

export default function ChatMain() {
  return (
    <>
      <div className='chatRoomWrap'>
        <div className='chatMain'>
          <img src={logo} />
          <div>대화하고 싶은 회원을 클릭해 채팅을 시작해보세요!</div>
        </div>
      </div>
    </>
  );
}
