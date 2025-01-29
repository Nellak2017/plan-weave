import Nav from './Nav'

const NavStories = {
	title: 'Molecules/Nav',
	component: Nav,
	argTypes: { variant: { control: 'text' }, },
}
const Template = args => <Nav {...args} />
export const Light = Template.bind({})
Light.args = {}
export const Dark = Template.bind({})
Dark.args = {}
export default NavStories