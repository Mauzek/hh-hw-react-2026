import { configureStore } from '@reduxjs/toolkit';
import { listenerMiddleware } from './middleware/persistenceMiddleware';
import settingsReducer from './slices/settingsSlice';
import reviewerReducer from './slices/reviewerSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    reviewer: reviewerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
