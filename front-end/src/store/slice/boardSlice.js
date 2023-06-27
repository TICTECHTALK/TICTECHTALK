import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { removeCookie } from 'util/Cookie';
import Instance from 'util/axiosConfig';

export const boardView = createAsyncThunk(
  'boards/view',
  async (postNo, thunkAPI) => {
    try {
      const res = await Instance.get(`/boards/${postNo}`);
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const boardUpdate = createAsyncThunk(
  'boards/update',
  async (postNo, thunkAPI) => {
    try {
      const res = await Instance.get(`/boards/update/${postNo}`);
      console.log(res);
      if (res.data === '수정 권한이 없습니다.') {
        alert('수정 권한이 없습니다.');
        return;
      }
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const boardDelete = createAsyncThunk(
  'boards/delete',
  async (postNo, thunkAPI) => {
    try {
      const res = await Instance.post(`/boards/delete/${postNo}`);
      console.log(res);
      if (res.data === '삭제 권한이 없습니다.') {
        alert('삭제 권한이 없습니다.');
        return;
      }
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const saveBookmark = createAsyncThunk(
  'boards/saveBookmark',
  async (postNo, thunkAPI) => {
    try {
      const res = await Instance.post(`/boards/delete/${postNo}`);
      console.log(res);
      if (res.data === '삭제 권한이 없습니다.') {
        alert('삭제 권한이 없습니다.');
        return;
      }
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

const initialState = {
  category: 0,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {},
});

export const {} = boardSlice.actions;
export default boardSlice.reducer;
