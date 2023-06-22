import { createSlice } from '@reduxjs/toolkit';

let initialState = { value: 'light' };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setDarkMode: (state) => {
      state.value = 'dark';
    },
    setLightMode: (state) => {
      state.value = 'light';
    },
  },
});

export const { setDarkMode, setLightMode } = themeSlice.actions;
export default themeSlice.reducer;
