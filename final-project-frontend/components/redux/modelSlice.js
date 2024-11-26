import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedModel: null, // No model selected initially
};

export const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    selectModel: (state, action) => {
      state.selectedModel = action.payload; // Select a model
    },
    resetModel: (state) => {
      state.selectedModel = null; // Reset model to null
    },
  },
});

export const { selectModel, resetModel } = modelSlice.actions;

export const selectSelectedModel = (state) => state.model.selectedModel; // Selector to get the selected model

export default modelSlice.reducer;
