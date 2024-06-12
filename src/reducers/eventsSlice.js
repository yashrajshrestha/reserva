import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchEvents =
    createAsyncThunk('events/fetchEvents',
        async (params) => {
            
            const {year, month} = params;
            let url = `${API_URL}/events/${year}/${month}`;
            // const queryParams = [];

            // if(year) queryParams.push(`year=${encodeURIComponent(year)}`);
            // if(month) queryParams.push(`month=${encodeURIComponent(month)}`);

            // if (queryParams.length){
            //     url += `?${queryParams.join('&')}`
            // }

            const response = await axios.get(url);
            return response.data;
        }
    );

export const addEvent =  
    createAsyncThunk('events/addEvent',
        async (event) => {
            const response = await axios.post(`${API_URL}/add-event`, event);
            return response.data; 
        }
    );

export const updateEvent = 
    createAsyncThunk('events/updateEvent',
        async (event) => {
            const response = await axios.put(`${API_URL}/update-event/${event.id}`, event);
            return response.data;
        }
    );

export const deleteEvent = 
    createAsyncThunk('events/deleteEvent',
        async (id) => {
            const response = await axios.delete(`${API_URL}/delete-event/${id}`);
            return response.data;
        }
    );

export const getHolidays =  
    createAsyncThunk('events/getHoliday',
        async (event) => {
            const response = await axios.post(`${API_URL}/get-holidays`, event);
            return response.data; 
        }
    );

export const fetchCountries =
    createAsyncThunk('events/fetchCountries',
        async () => {
            const response = await axios.get(`${API_URL}/get-countries`);
            return response.data;
        }
    );

const eventsSlice = createSlice({
    name: 'events',
    initialState:{
        events: [],
        status: 'idle',
        error: null,
        holidays: [],
        countries: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchEvents.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        }).addCase(fetchEvents.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.events = action.payload;
        }).addCase(fetchEvents.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }).addCase(addEvent.fulfilled, (state, action) => {
            state.events.push(action.payload);
        }).addCase(updateEvent.fulfilled, (state, action) => {
            const index = state.events.findIndex(event => event.id === action.payload.id);
            state.events[index] = action.payload;
        }).addCase(deleteEvent.fulfilled, (state, action) => {
            state.events = state.events.filter(event => event.id !== action.payload);
        }).addCase(getHolidays.fulfilled, (state, action)=> {
            state.holidays = action.payload;
        }).addCase(fetchCountries.fulfilled, (state, action)=> {
            state.countries.push(action.payload);
        })
    }
});

export default eventsSlice.reducer;