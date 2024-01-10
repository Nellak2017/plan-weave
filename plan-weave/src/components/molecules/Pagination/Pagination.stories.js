import Pagination from './Pagination'

const PaginationStories = {
	title: 'Molecules/Pagination',
	component: Pagination,
	argTypes: {
		variant: { control: 'text' },
	},
}

const Template = args => {
	return <Pagination {...args} />
}

export const Light = Template.bind({})
Light.args = {
	variant: 'light',
}

export const Dark = Template.bind({})
Dark.args = {
	variant: 'dark',
}

export default PaginationStories