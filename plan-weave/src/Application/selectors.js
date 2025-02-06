import { useSelector } from 'react-redux' 
// TODO: Add more business constraints here for these selectors
export const tasks = (selector = useSelector) => selector(state => state?.tasks) 
export const userId = () => '' // TODO: make session context for this
export const variant = (selector = useSelector) => selector(state => state?.variant)
export const isOwl = (selector = useSelector) => selector(state => state?.toggle?.owlTaskEditor?.toggleState)
export const isFullTask = (selector = useSelector) => selector(state => state?.toggle?.fullTaskTaskEditor?.toggleState)
export const fsmControlledState = (selector = useSelector) => selector(state => state?.multiDelete?.multiDeleteTaskEditor?.fsmControlledState)
export const timeRange = (selector = useSelector) => selector(state => state?.timeRange)