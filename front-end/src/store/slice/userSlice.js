import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { removeCookie, setCookie } from 'util/Cookie';
import Instance from 'util/axiosConfig';

export const join = createAsyncThunk(
  'users/join',
  async (userData, thunkAPI) => {
    try {
      const res = await Instance.post('users/join', userData);
      if (res.data === 'USEREMAIL_DUPLICATED') {
        alert('이미 가입된 이메일입니다.');
        return;
      }
      if (res.data === 'NICKNAME_DUPLICATED') {
        alert('중복된 닉네임입니다.');
        return;
      }
      alert('회원가입이 완료되었습니다.');
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const login = createAsyncThunk(
  'users/login',
  async (userData, thunkAPI) => {
    try {
      const res = await Instance.post('users/login', userData);
      if (res.data === 'USEREMAIL_NOT_FOUND') {
        alert('이메일을 찾을 수 없습니다.');
        return;
      }
      if (res.data === 'INVALID_PASSWORD') {
        alert('비밀번호가 틀렸습니다.');
        return;
      }
      console.log(res);
      const accessToken = res.headers['authorization'].split(' ')[1];
      const refreshToken = res.headers['refreshtoken'];
      localStorage.setItem('accessToken', accessToken);
      setCookie('refreshToken', refreshToken);
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      // console.log(err);
      throw err;
    }
  }
);

export const logout = createAsyncThunk(
  'users/logout',
  async (payload, thunkAPI) => {
    try {
      const res = await Instance.post('users/logout');
      if (res.data === '로그아웃 성공') {
        localStorage.removeItem('accessToken');
        removeCookie('refreshToken');
      }
      return thunkAPI.fulfillWithValue(res.payload);
    } catch (err) {
      console.log(err);
      if (err.response.status === 409) alert('로그아웃 오류가 발생했습니다.');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (payload, thunkAPI) => {
    try {
      const res = await Instance.post('users/delete');
      localStorage.removeItem('accessToken');
      removeCookie('refreshToken');
      console.log('회원탈퇴 성공');
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const getInfo = createAsyncThunk(
  'users/getInfo',
  async (payload, thunkAPI) => {
    try {
      const res = await Instance.get('mypage/info');
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const updateInfo = createAsyncThunk(
  'users/updateInfo',
  async (payload, thunkAPI) => {
    try {
      const res = await Instance.post('mypage/update', payload);
      if (res.data === 'NIKCNAME_DUPLICATED') {
        alert('중복된 닉네임입니다.');
        return;
      }
      alert('회원정보 수정이 완료되었습니다.');
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const getBookmarkList = createAsyncThunk(
  'users/getBookmarkList',
  async (payload, thunkAPI) => {
    try {
      const res = await Instance.get('mypage/bookmark/get');
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const getMyPost = createAsyncThunk(
  'users/getMyPost',
  async (payload, thunkAPI) => {
    try {
      const res = await Instance.get('mypage/mypost');
      console.log(res);
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

const initialState = {
  userNo: 0,
  userEmail: '비회원',
  userNick: '비회원',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userNo = Number(action.payload.userNo);
      state.userEmail = action.payload.sub;
      state.userNick = action.payload.userNick;
    },
    unsetUser: (state) => {
      state.userNo = 0;
      state.userEmail = '비회원';
      state.userNick = '비회원';
    },
  },
  immer: true,
});

export const { setUser, unsetUser } = userSlice.actions;
export default userSlice.reducer;
