import { createSlice } from "@reduxjs/toolkit"
import { rearrangeDnD, addDnDConfig, deleteMultipleDnDEvent } from "../../Core/utils/helpers"

const dnd = createSlice({
    name: 'dnd',
    initialState: [],
    reducers: {
        addDnD: (state) => addDnDConfig(Array.from(state)),
        updateDnD: (state, action) => {
            const [source, destination] = action.payload
            return rearrangeDnD(Array.from(state), source, destination)
        },
        deleteMultipleDnD: (state, action) => {
            const { indices } = action.payload
            return deleteMultipleDnDEvent(Array.from(state), indices)
        }
    }
})
export const { addDnD, updateDnD, deleteMultipleDnD } = dnd.actions
export default dnd.reducer