import { createSlice } from '@reduxjs/toolkit'
const initialState = null;

export const jsonSlice = createSlice({
    name: 'Auth',
    initialState,
    reducers: {
        setConfig: (state, { payload }) => {
            return {
                ...state,
                APP: payload?.APP
            }
        }
    },
})

export const { setConfig } = jsonSlice.actions
export default jsonSlice.reducer;