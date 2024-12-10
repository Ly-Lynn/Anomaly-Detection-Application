import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedModel: null, 
  selectedDataModule: null,
};

export const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    selectModel: (state, action) => {
      console.log("Update selected model: ", action.payload);
      state.selectedModel = action.payload; 
    },
    resetModel: (state) => {
      state.selectedModel = null; 
    },
    selectDataModule: (state, action) => {
      console.log("Update selected data module: ", action.payload);
      state.selectedDataModule = action.payload;
    },
    resetDataModule: (state) => {
      state.selectedDataModule = null; 
    }
  },
});


export const { selectModel, resetModel, selectDataModule, resetDataModule } = modelSlice.actions;

export const selectSelectedModel = (state) => state.model.selectedModel; // Selector to get the selected model

export const selectSelectedDataModule = (state) => state.model.selectedDataModule; // Selector to get the selected data module
export default modelSlice.reducer;
