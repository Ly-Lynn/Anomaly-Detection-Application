import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  history: [], // { frameUri, heatmapUri } inference history
};

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addInferenceResult: (state, action) => {
      state.history.push(action.payload); 
    },
    resetHistory: (state) => {
      state.history = []; 
    },
  },
});

export const { addInferenceResult, resetHistory } = historySlice.actions;

export const selectInferenceHistory = (state) => state.history.history; // Selector to get the history

export default historySlice.reducer;
