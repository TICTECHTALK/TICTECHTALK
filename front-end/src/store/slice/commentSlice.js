import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Instance from 'util/axiosConfig';

export const getCmList = createAsyncThunk(
  'boards/getCmList',
  async (payload, thunkAPI) => {
    try {
      const res = await Instance.get(
        `/comments/list?page=${payload.page - 1}&postNo=${payload.postNo}`
      );
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const cmWrite = createAsyncThunk(
  'boards/cmWrite',
  async (payload, thunkAPI) => {
    try {
      const res = await Instance.post('/comments/write', payload);
      console.log(res);
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const cmDelete = createAsyncThunk(
  'boards/cmDelete',
  async (cmId, thunkAPI) => {
    try {
      const res = await Instance.post(`/comments/delete/${cmId}`);
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const cmLike = createAsyncThunk(
  'boards/cmLike',
  async (cmId, thunkAPI) => {
    try {
      const res = await Instance.post(`/comments/delete/${cmId}`);
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const cmDisLike = createAsyncThunk(
  'boards/cmDisLike',
  async (cmId, thunkAPI) => {
    try {
      const res = await Instance.post(`/comments/delete/${cmId}`);
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
