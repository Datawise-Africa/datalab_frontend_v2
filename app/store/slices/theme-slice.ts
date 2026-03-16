import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ThemeState {
  primaryHue: number;
  secondaryHue: number;
  tertiaryHue: number;
  fontFamily: string;
  fontMono: string;
  borderRadius: number;
  borderWidth: number;
  darkMode: boolean;
}

const initialState: ThemeState = {
  primaryHue: 260,
  secondaryHue: 160,
  tertiaryHue: 30,
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', monospace",
  borderRadius: 0.5,
  borderWidth: 1,
  darkMode: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    updateTheme(state, action: PayloadAction<Partial<ThemeState>>) {
      return { ...state, ...action.payload };
    },
    setPrimaryHue(state, action: PayloadAction<number>) {
      state.primaryHue = action.payload;
    },
    setSecondaryHue(state, action: PayloadAction<number>) {
      state.secondaryHue = action.payload;
    },
    setTertiaryHue(state, action: PayloadAction<number>) {
      state.tertiaryHue = action.payload;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },
    resetTheme() {
      return initialState;
    },
  },
});

export const {
  updateTheme,
  setPrimaryHue,
  setSecondaryHue,
  setTertiaryHue,
  toggleDarkMode,
  setDarkMode,
  resetTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
