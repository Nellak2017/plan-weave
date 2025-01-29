import Pagination from './Pagination'

const PaginationStories = {
	title: 'Molecules/Pagination',
	component: Pagination,
	argTypes: { variant: { control: 'text' }, },
}
const Template = args => <Pagination {...args} />
export const Light = Template.bind({})
Light.args = {
	state: { variant: 'light' },
}
export const Dark = Template.bind({})
Dark.args = {
	state: { 
		variant: 'dark', 
		taskListLength: 21,
		pageNumber: 1, 
		tasksPerPage: 20, 
	},
}
export default PaginationStories