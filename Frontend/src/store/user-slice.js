import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: '681e24adb39582f66be541a3'
};

const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        removeUser: state => {
            state.user = null;
        },

        addUser: (state, action) => {
            state.user = action.payload
        }
    }
});

export default userSlice.reducer;

export const userActions = userSlice.actions;