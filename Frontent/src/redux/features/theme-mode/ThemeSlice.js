import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme:  'light', // Default to light theme
  dark_mode: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {

      state.theme = state.theme === 'light' ? 'dark' : 'light';
     state.dark_mode=!state.dark_mode;
    
    
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
