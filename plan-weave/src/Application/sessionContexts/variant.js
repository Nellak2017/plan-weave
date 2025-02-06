import { createSlice } from "@reduxjs/toolkit"
import { VARIANTS } from "../../Core/utils/constants"

const variant = createSlice({
    name: 'variant',
    initialState: VARIANTS[0],
    reducers: {
        updateVariant: (state, action) => {
            const { value } = action.payload
            if (VARIANTS.includes(value)) { state.variant = value }
        }
    }
})
export const { updateVariant } = variant.actions
export default variant.reducer