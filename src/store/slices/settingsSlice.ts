import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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

export const hydrateSettings = createAsyncThunk<
  Omit<SettingsState, '_hydrated'>,
  void,
  { rejectValue: string }
>('settings/hydrate', (_, { rejectWithValue }) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Omit<SettingsState, '_hydrated'>;
    }
    return { login: '', repo: '', blacklist: [] };
  } catch {
    console.warn('Не удалось загрузить настройки');
    return rejectWithValue('Не удалось загрузить настройки');
  }
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings(
      state,
      action: PayloadAction<Omit<SettingsState, '_hydrated'>>,
    ) {
      state.login = action.payload.login;
      state.repo = action.payload.repo;
      state.blacklist = action.payload.blacklist;
    },
    resetSettings(state) {
      state.login = '';
      state.repo = '';
      state.blacklist = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateSettings.fulfilled, (state, action) => {
        state.login = action.payload.login;
        state.repo = action.payload.repo;
        state.blacklist = action.payload.blacklist;
        state._hydrated = true;
      })
      .addCase(hydrateSettings.rejected, (state) => {
        state._hydrated = true;
      });
  },
});

export const { updateSettings, resetSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
