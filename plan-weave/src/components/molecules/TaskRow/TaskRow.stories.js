import TaskRow from './TaskRow'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

export default {
	title: 'Molecules/TaskRow',
	component: TaskRow,
	argTypes: {
		variant: { control: 'text' },
	},
}

// dummy context included to avoid errors
const Template = args =>
	<DragDropContext onDragEnd={() => { console.log('dummy context') }}>
		<Droppable droppableId="taskTable" type="TASK">
			{(provided) => (
				<tbody ref={provided.innerRef} {...provided.droppableProps}>
					<TaskRow {...args} index={0}/>
					{provided.placeholder}
				</tbody>
			)}
		</Droppable>
	</DragDropContext>

export const Light = Template.bind({})
Light.args = {
	variant: 'light',
	waste: '1 hour'
}

export const Dark = Template.bind({})
Dark.args = {
	variant: 'dark',
	waste: '1 hour'
}