import Nav from './Nav'

const NavStories = {
	title: 'Molecules/Nav',
	component: Nav,
	argTypes: {
		variant: { control: 'text' },
	},
}

const Template = args => <Nav {...args} />

export const Light = Template.bind({})
Light.args = {
	variant: 'light',
}

export const Dark = Template.bind({})
Dark.args = {
	variant: 'dark',
}

export default NavStories