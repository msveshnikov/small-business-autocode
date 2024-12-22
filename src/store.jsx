import { configureStore, createSlice } from '@reduxjs/toolkit';

const websiteElementsSlice = createSlice({
    name: 'websiteElements',
    initialState: [],
    reducers: {
        addElement: (state, action) => {
            state.push(action.payload);
        },
        updateElements: (state, action) => {
            return action.payload;
        }
    }
});

const appointmentsSlice = createSlice({
    name: 'appointments',
    initialState: [],
    reducers: {
        addAppointment: (state, action) => {
            state.push(action.payload);
        },
        updateAppointments: (state, action) => {
            return action.payload;
        }
    }
});

const clientsSlice = createSlice({
    name: 'clients',
    initialState: [],
    reducers: {
        addClient: (state, action) => {
            state.push(action.payload);
        },
        updateClients: (state, action) => {
            return action.payload;
        }
    }
});

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        selectedTab: 'builder',
        selectedDate: new Date()
    },
    reducers: {
        setSelectedTab: (state, action) => {
            state.selectedTab = action.payload;
        },
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload;
        }
    }
});

export const { addElement, updateElements } = websiteElementsSlice.actions;
export const { addAppointment, updateAppointments } = appointmentsSlice.actions;
export const { addClient, updateClients } = clientsSlice.actions;
export const { setSelectedTab, setSelectedDate } = uiSlice.actions;

const store = configureStore({
    reducer: {
        websiteElements: websiteElementsSlice.reducer,
        appointments: appointmentsSlice.reducer,
        clients: clientsSlice.reducer,
        ui: uiSlice.reducer
    }
});

export default store;
