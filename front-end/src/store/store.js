import { configureStore } from '@reduxjs/toolkit';
import userReducer from 'store/slice/userSlice';
import themeReducer from 'store/slice/themeSlice';
import chatReducer from 'store/slice/chatSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    chat: chatReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
