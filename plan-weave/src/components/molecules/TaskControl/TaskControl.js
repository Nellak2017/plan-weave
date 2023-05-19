import SearchBar from '../../atoms/SearchBar/SearchBar.js'
import DropDownButton from '../../atoms/DropDownButton/DropDownButton'
import { TaskControlContainer } from './TaskControl.elements'
import TimePickerWrapper from '../../atoms/TimePickerWrapper/TimePickerWrapper.js'

function TaskControl({ variant, color, maxwidth = 818, maxwidthsearch, ...rest }) {
	return (
		<TaskControlContainer variant={variant} maxwidth={maxwidth}>
			<SearchBar variant={variant} maxwidth={maxwidthsearch}{...rest} />
			<DropDownButton variant={variant} color={color} {...rest}>

			</DropDownButton>
			{/* Add the Date Picker component here */}
			<div style={{display:'flex',columnGap:'8px'}}>
				<TimePickerWrapper />
				<TimePickerWrapper displayText="End"/>
			</div>
		</TaskControlContainer>
	)
}

export default TaskControl