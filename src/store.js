import { configureStore } from '@reduxjs/toolkit';
import eventReducer from './reducers/eventsSlice';
import socketReducer from './reducers/socketSlice';

const store = configureStore({
    reducer: {
        events: eventReducer,
        socket: socketReducer,
    },
});

export default store;