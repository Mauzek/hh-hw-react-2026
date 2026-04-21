import { createListenerMiddleware } from '@reduxjs/toolkit';
import { updateSettings, resetSettings } from '../slices/settingsSlice';

const STORAGE_KEY = 'reviewer-settings';

interface AppState {
  settings: {
    login: string;
    repo: string;
    blacklist: string[];
  };
}

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: updateSettings,
  effect: (_, listenerApi) => {
    const state = listenerApi.getState() as AppState;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          login: state.settings.login,
          repo: state.settings.repo,
          blacklist: state.settings.blacklist,
        }),
      );
    } catch {
      console.warn('Не удалось сохранить настройки');
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: resetSettings,
  effect: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      console.warn('Не удалось удалить настройки');
    }
  },
});
