import { setDefaultTime } from './timeRangeSlice.js'

export const updateTimeRangeThunk = ({ id, value }) => dispatch => { dispatch(setDefaultTime({ id, value: value.toISOString() })) } // Reducer + Business Logic