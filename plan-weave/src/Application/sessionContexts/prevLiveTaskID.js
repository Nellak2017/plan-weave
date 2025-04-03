import { createSlice } from "@reduxjs/toolkit"

const prevLiveTaskID = createSlice({
    name: 'prevLiveTaskID',
    initialState: 0,
    reducers: { setPrevLiveTaskID: (_, action) => action?.payload, }
})
export const { setPrevLiveTaskID } = prevLiveTaskID.actions
export default prevLiveTaskID.reducer