export default function Mypage() {
  return (
    <div class='myPageBox roundedRectangle darkModeElement'>
      <form>
        <div class='myPageProfile'></div>
        <label for='profileInput' class='btnElement userPicUpload'>
          프로필 사진 업로드
        </label>
        <input type='file' id='profileInput' />
        <div className='profileInfo'>abcde@gmail.com</div>
        <div className='profileInfo'>123 point</div>
        <input
          type='password'
          class='userPassword darkModeElement'
          placeholder='비밀번호 변경'
          value='12345'
        />
        <input
          type='password'
          class='userPassword darkModeElement'
          placeholder='비밀번호 확인'
          value='12345'
        />
        <input
          value='김블랙맘바'
          class='darkModeElement'
          placeholder='닉네임'
        />
        <textarea class='darkModeElement'>
          안녕하세요 동에번쩍 서에번쩍 김블랙맘바입니다!
        </textarea>
        <button class='btnElement'>프로필 수정</button>
      </form>
    </div>
  );
}
