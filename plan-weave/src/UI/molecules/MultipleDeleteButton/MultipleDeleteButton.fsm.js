import { toast } from 'react-toastify' // for the action
import DeleteModal from '../../atoms/DeleteModal/DeleteModal.js' // for the action
import { MULTIPLE_DELETE_MODAL_TOAST_CONFIG } from '../../../Core/utils/constants.js'
// --- Actions
// TODO: Possibly parameterize based on optionHandlers with default optionHandlers OR import option handlers from elsewhere
const defaultDeleteModalChooseStateOptions = [() => console.warn('Event for yes not implemented'), () => console.warn('Event for no not implemented')]
const chosenAction = (optionHandlers = defaultDeleteModalChooseStateOptions) => toast.warning(({ closeToast }) => (
    <DeleteModal services={{ optionHandlers, closeToast }} />), MULTIPLE_DELETE_MODAL_TOAST_CONFIG)
const choseAction = () => { toast.info('You may now select multiple tasks to delete at once! Click again to toggle.') }
// --- State Machine
export const { DEFAULT, CHOOSE, CHOSEN, MODAL } = { DEFAULT: 'default', CHOOSE: 'choose', CHOSEN: 'chosen', MODAL: 'modal' } // Multi-delete allowed States
export const { CLICK_TRASH_EVENT, MIN_1_EVENT, MAX_0_EVENT, CLICK_DELETE_EVENT, YES_EVENT, NO_EVENT } = { CLICK_TRASH_EVENT: 'clickTrash', MIN_1_EVENT: 'min1', MAX_0_EVENT: 'max0', CLICK_DELETE_EVENT: 'clickDelete', YES_EVENT: 'yes', NO_EVENT: 'no' } // Multi-delete allowed Events
export const { IS_HIGHLIGHTING, IS_CHOOSE_ALLOWED, ACTION } = { IS_HIGHLIGHTING: 'isHighlighting', IS_CHOOSE_ALLOWED: 'isChooseAllowed', ACTION: 'action' } // Multi-delete allowed values
export const MultiDeleteFSM = { // TODO: Figure out how to do Actions when transitioning _Out_ of a state instead of just _Into_ a state. We will need it for the Delete task action
    initial: DEFAULT,
    states: {
        [DEFAULT]: {
            [IS_HIGHLIGHTING]: false, [IS_CHOOSE_ALLOWED]: false, [ACTION]: () => { },
            transitions: { [CLICK_TRASH_EVENT]: CHOOSE } // else DEFAULT
        },
        [CHOOSE]: {
            [IS_HIGHLIGHTING]: true, [IS_CHOOSE_ALLOWED]: true, [ACTION]: choseAction,
            transitions: { [MIN_1_EVENT]: CHOSEN, [CLICK_TRASH_EVENT]: DEFAULT } // else CHOOSE
        },
        [CHOSEN]: {
            [IS_HIGHLIGHTING]: true, [IS_CHOOSE_ALLOWED]: true, [ACTION]: chosenAction,
            transitions: { [CLICK_DELETE_EVENT]: MODAL, [MAX_0_EVENT]: CHOOSE, [CLICK_TRASH_EVENT]: DEFAULT } // else CHOSEN
        },
        [MODAL]: {
            [IS_HIGHLIGHTING]: true, [IS_CHOOSE_ALLOWED]: false, [ACTION]: () => { },
            transitions: { [YES_EVENT]: DEFAULT, [NO_EVENT]: CHOSEN } // else MODAL
        },
    }
}
// --- State Machine Getters
export const getFSMTransition = (state, event, fsm = MultiDeleteFSM) => fsm?.states?.[state]?.transitions?.[event] || state // do tansition or do self-transition in default case
export const getFSMValue = (state, value, fsm = MultiDeleteFSM) => fsm?.states?.[state]?.[value] // no default value other than undefined
export const getDefaultState = (fsm = MultiDeleteFSM) => fsm?.initial
// --- State Machine Handlers (In theory, you could auto-generate these with an object map)
export const handleTrashClick = (setFsmState, fsmState) => setFsmState(getFSMTransition(fsmState, CLICK_TRASH_EVENT))
export const handleMinOne = (setFsmState, fsmState) => setFsmState(getFSMTransition(fsmState, MIN_1_EVENT))
export const handleMaxZero = (setFsmState, fsmState) => setFsmState(getFSMTransition(fsmState, MAX_0_EVENT))
export const handleDeleteClick = (setFsmState, fsmState) => setFsmState(getFSMTransition(fsmState, CLICK_DELETE_EVENT))
export const handleYes = (setFsmState, fsmState) => setFsmState(getFSMTransition(fsmState, YES_EVENT))
export const handleNo = (setFsmState, fsmState) => setFsmState(getFSMTransition(fsmState, NO_EVENT))