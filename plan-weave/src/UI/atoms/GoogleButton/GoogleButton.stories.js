import GoogleButton from './GoogleButton'

const GoogleButtonStories = {
	title: 'Atoms/Buttons/GoogleButton',
	component: GoogleButton,
	argTypes: {
		signup: { control: 'boolean' },
	},
}

const Template = args => <GoogleButton {...args} />

export const LogIn = Template.bind({})
LogIn.args = {
	signup: false,
}

export const SignUp = Template.bind({})
SignUp.args = {
	signup: true,
}

export default GoogleButtonStories