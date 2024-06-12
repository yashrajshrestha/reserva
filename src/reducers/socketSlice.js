import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL;
const ORIGIN_URL = process.env.REACT_APP_ORIGIN_URL;
const socket = io(API_URL,{
    transports: ["websocket"],
    cors: {
        origin: ORIGIN_URL,
    },
});

const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        connected: false,
        notification: [],
    },
    reducers: {
        connect: (state) => {
            state.connected = true;
        },
        disconnect: (state) => {
            state.connected = false;
        },
        addNotification: (state, action) => {
            state.notification.push(action.payload);        
        }
    },
});

export const { connect, disconnect, addNotification } = socketSlice.actions;

export const initializeSocket = () => (dispatch) => {
    socket.on('connect', () => {
        console.log('Connected to server');
        dispatch(connect());
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        dispatch(disconnect());
    });

    socket.on('event_notification', (data) => {
        console.log('Received notification:', data);
        dispatch(addNotification(data));
    });
};

export default socketSlice.reducer


