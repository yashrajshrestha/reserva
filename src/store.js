import { configureStore } from '@reduxjs/toolkit';
import eventReducer from './reducers/eventsSlice';

const store = configureStore({
    reducer: {
        events: eventReducer,
    },
});

export default store;