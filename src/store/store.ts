import { configureStore } from '@reduxjs/toolkit';
import pollReducer from './pollSlice';

// Configure Redux store for polling state management
export const store = configureStore({
  reducer: {
    poll: pollReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;