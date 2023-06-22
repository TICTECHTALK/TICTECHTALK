import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Instance from 'util/axiosConfig';

const initialState = [];

export const create = createAsyncThunk(
  'chat/create',
  async (data, thunkAPI) => {
    try {
      const res = await Instance.post(
        'http://localhost:8080/chat/create',
        data
      );
      alert('채팅방 생성이 완료되었습니다.');
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const getRoomList = createAsyncThunk(
  'chat/getRoomList',
  async (data, thunkAPI) => {
    try {
      const res = await Instance.get('http://localhost:8080/chat/list');
      if (!res) return res;
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setList: (state, action) => {
      state.chatList.push(action.payload);
    },
  },
});

export const { setList } = chatSlice.actions;
export default chatSlice.reducer;
