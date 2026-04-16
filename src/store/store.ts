import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './slices/settingsSlice';
import reviewerReducer from './slices/reviewerSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    reviewer: reviewerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
