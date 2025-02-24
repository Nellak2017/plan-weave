import { createSlice } from "@reduxjs/toolkit"

const auth = createSlice({
    name: 'auth',
    initialState: { userID: '' },
    reducers: { setUserID: (state, action) => ({ ...state, userID: action?.payload?.userID }), }
})
export const { setUserID } = auth.actions
export default auth.reducer