import { useEffect, useState } from "react" 
import { Droppable } from "react-beautiful-dnd"

const StrictModeDroppable = ({ children, ...props }) => { // This is only here because react-beautiful-dnd doesn't work in react safe mode. So this is the solution that works even in safe-mode
	const [enabled, setEnabled] = useState(false)
	useEffect(() => () => {
		cancelAnimationFrame(requestAnimationFrame(() => setEnabled(true)))
		setEnabled(false)
	}, [])
	if (!enabled) { return null }
	return <Droppable {...props}>{children}</Droppable>
}
export default StrictModeDroppable