import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  login: string;
  repo: string;
  blacklist: string[];
  _hydrated: boolean;
}

const STORAGE_KEY = 'reviewer-settings';

const initialState: SettingsState = {
  login: '',
  repo: '',
  blacklist: [],
  _hydrated: false,
};

const saveToStorage = (state: SettingsState): void => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        login: state.login,
        repo: state.repo,
        blacklist: state.blacklist,
      }),
    );
  } catch {
    console.warn('Не удалось сохранить настройки');
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    hydrateSettings(state) {
      if (state._hydrated) {
        return;
      }

      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Omit<SettingsState, '_hydrated'>;
          state.login = parsed.login ?? '';
          state.repo = parsed.repo ?? '';
          state.blacklist = parsed.blacklist ?? [];
        }
      } catch {
        console.warn('Не удалось загрузить настройки');
      }

      state._hydrated = true;
    },
    updateSettings(
      state,
      action: PayloadAction<Omit<SettingsState, '_hydrated'>>,
    ) {
      state.login = action.payload.login;
      state.repo = action.payload.repo;
      state.blacklist = action.payload.blacklist;
      saveToStorage(state);
    },
    resetSettings(state) {
      state.login = '';
      state.repo = '';
      state.blacklist = [];
      state._hydrated = true;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { hydrateSettings, updateSettings, resetSettings } =
  settingsSlice.actions;

export default settingsSlice.reducer;
