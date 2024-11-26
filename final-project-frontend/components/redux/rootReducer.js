import { combineReducers } from '@reduxjs/toolkit';
import historyReducer from './historySlice';
import modelReducer from './modelSlice';

const rootReducer = combineReducers({
  history: historyReducer, // Reducer for history
  model: modelReducer, // Reducer for selected model
});

export default rootReducer;
