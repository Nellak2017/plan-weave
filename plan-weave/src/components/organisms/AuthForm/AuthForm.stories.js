import AuthForm from './AuthForm'

const AuthFormStories = {
	title: 'Organisms/AuthForm',
	component: AuthForm,
	argTypes: {
		variant: { control: 'text' },
	},
}

const Template = args => <AuthForm {...args} />

export const Light = Template.bind({})
Light.args = {
	variant: 'light',
}

export const Dark = Template.bind({})
Dark.args = {
	variant: 'dark',
	signup: true
}

export default AuthFormStories