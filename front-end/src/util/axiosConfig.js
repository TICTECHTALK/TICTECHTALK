import axios from 'axios';
import { getCookie, removeCookie, setCookie } from './Cookie';

// 서버단 주소 설정
const apiUrl = 'http://localhost:8080/';

const Instance = axios.create({
  baseURL: apiUrl,
  timeout: 1000,
});

// 요청 쌔비지
Instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');

  // 액세스 토큰이 없으면
  if (!accessToken) {
    // header에 null 담아 보내기
    config.headers['authorization'] = null;
    config.headers['refreshToken'] = null;
    return config;
  }

  // 액세스 토큰이 있으면
  if (accessToken) {
    config.headers['authorization'] = `Bearer ${accessToken}`;
    return config;
  }
});

// 응답 쌔비지
Instance.interceptors.response.use(
  // fullfiled
  async (res) => {
    // if (!res.headers['authorization']) {
    //   return res;
    // }
    // const accessToken = res.headers['authorization'].split(' ')[1];
    // const refreshToken = res.headers['refreshtoken'];
    // localStorage.setItem('accessToken', accessToken);
    // setCookie('refreshToken', refreshToken);
    return res;
  },

  // rejected
  async (err) => {
    // 에러 확인용 콘솔 출력
    console.log(err);
    const originalConfig = err.config;
    // 서버 오류일때
    if (err.code === 'ECONNABORTED') {
      throw 'ECONNABORTED';
    }
    // 토큰 만료 오류일때
    if (err.response.data.code === 'TOKEN-001') {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = getCookie('refreshToken');
      try {
        const res = await axios.post(apiUrl + 'users/reissue', null, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            RefreshToken: refreshToken,
          },
        });
        if (res) {
          const accessToken = res.headers['authorization'].split(' ')[1];
          const refreshToken = res.headers['refreshtoken'];
          localStorage.setItem('accessToken', accessToken);
          // removeCookie('refreshToken');
          setCookie('refreshToken', refreshToken);
          console.log('토큰 재발급 완료');
          return await Instance.request(originalConfig);
        }
      } catch (err) {
        console.log(err);
        console.log('토큰 재발급 오류 발생');
      }
    }
    // 로그인 오류일때
    if (err.response.data === 'USEREMAIL_NOT_FOUND ') {
      alert('가입되지 않은 이메일입니다.');
      return;
    }
    if (
      err.response.data === 'INVALID_PASSWORD 패스워드를 잘못 입력했습니다.'
    ) {
      alert('패스워드를 잘못 입력하셨습니다.');
      return;
    }
    // 회원가입 오류일때
    if (err.response.data.includes('NICKNAME_DUPLICATED')) {
      alert('이미 있는 닉네임입니다.');
      return;
    }
    if (err.response.data.includes('USEREMAIL_DUPLICATED')) {
      alert('이미 있는 이메일입니다.');
      return;
    }

    throw err;
  }
);

export default Instance;
