// This is only here because react-beautiful-dnd doesn't work in react safe mode. 
// So this is the solution that works even in safe-mode
import { useEffect, useState } from "react"
import { Droppable } from "react-beautiful-dnd"
import PropTypes from 'prop-types'

const StrictModeDroppable = ({ children, ...props }) => {
	const [enabled, setEnabled] = useState(false)

	useEffect(() => {
		const animation = requestAnimationFrame(() => setEnabled(true))
		return () => {
			cancelAnimationFrame(animation)
			setEnabled(false)
		}
	}, [])

	if (!enabled) { return null }

	return <Droppable {...props}>{children}</Droppable>
}

StrictModeDroppable.propTypes = {
	children: PropTypes.node.isRequired,
}

export default StrictModeDroppable