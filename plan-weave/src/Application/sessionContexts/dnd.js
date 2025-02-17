import { createSlice } from "@reduxjs/toolkit"
import { rearrangeDnD, addDnDConfig } from "../../Core/utils/helpers"

const dnd = createSlice({
    name: 'dnd',
    initialState: [],
    reducers: {
        addDnD: (state) => addDnDConfig(Array.from(state)),
        updateDnD: (state, action) => {
            const [source, destination] = action.payload
            return rearrangeDnD(Array.from(state), source, destination)
        }
    }
})
export const { addDnD, updateDnD } = dnd.actions
export default dnd.reducer