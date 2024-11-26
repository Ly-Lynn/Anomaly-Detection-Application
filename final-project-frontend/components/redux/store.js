import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'; // Import the combined reducer

const store = configureStore({
  reducer: rootReducer, // Root reducer that combines history and model reducers
});

export default store;
