import Pagination from './Pagination'
import { calcMaxPage } from '../../../Core/utils/helpers'

const PaginationStories = {
	title: 'Molecules/Pagination',
	component: Pagination,
	argTypes: { variant: { control: 'text' }, },
}
const Template = args => <Pagination {...args} />
export const Light = Template.bind({})
Light.args = { customHook: () => ({ childState: { variant: 'light' }}),}
export const Dark = Template.bind({})
Dark.args = {
	customHook: () => ({
		childState: {
			variant: 'dark',
			maxPage: calcMaxPage(21, 10), // If you want more interactivity, you have to make a full-blown custom hook
			localPageNumber: 1,
			tasksPerPage: 21,
		} 
	})
}
export default PaginationStories