// --- State Machine
export const { DEFAULT, FIRST_HOURS, HOURS, MINUTES } = { DEFAULT: 'default', FIRST_HOURS: 'firstHours', HOURS: 'hours', MINUTES: 'minutes' } // Time Picker allowed States
export const { CLICK_EVENT, BLUR_EVENT, VIEW_CHANGE_EVENT } = { CLICK_EVENT: 'click', BLUR_EVENT: 'blur', VIEW_CHANGE_EVENT: 'viewChange' } // Time Picker allowed Events
export const { VIEW, SHOW_CLOCK } = { VIEW: 'view', SHOW_CLOCK: 'showClock' } // Time Picker allowed values
export const TimePickerFSM = {
  [DEFAULT]: { [VIEW]: HOURS, [SHOW_CLOCK]: false, transitions: { [CLICK_EVENT]: FIRST_HOURS } },
  [FIRST_HOURS]: { [VIEW]: HOURS, [SHOW_CLOCK]: true, transitions: { [BLUR_EVENT]: HOURS, } },
  [HOURS]: { [VIEW]: HOURS, [SHOW_CLOCK]: true, transitions: { [VIEW_CHANGE_EVENT]: MINUTES, } },
  [MINUTES]: { [VIEW]: MINUTES, [SHOW_CLOCK]: true, transitions: {} },
}
// --- Getters
export const getFSMTransition = (state, event, fsm = TimePickerFSM) => fsm?.[state]?.transitions?.[event] || DEFAULT
export const getFSMValue = (state, value, fsm = TimePickerFSM) => fsm?.[state]?.[value] // no default value other than undefined
// --- Handlers
export const handleClick = (setFsmState, fsmState) => setFsmState(getFSMTransition(fsmState, CLICK_EVENT))
export const handleViewChange = (setFsmState, fsmState) => setFsmState(getFSMTransition(fsmState, VIEW_CHANGE_EVENT))
export const handleBlur = (setFsmState, fsmState) => setFsmState(getFSMTransition(fsmState, BLUR_EVENT))