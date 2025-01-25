import HoursInput from './HoursInput'

const HoursInputStories = {
	title: 'Atoms/input/HoursInput',
	component: HoursInput,
	argTypes: {
		placeholder: { control: 'text' },
		text: { control: 'text' },
		variant: { control: 'text' },
		color: { control: 'text' },
		maxwidth: { control: 'number' },
		initialValue: { control: 'number' }
	},
}

const Template = args => <HoursInput {...args} />


export const Light = Template.bind({})
Light.args = {
	state: {
		variant: 'light',
		text: 'Hours',
	}
}

export const Dark = Template.bind({})
Dark.args = {
	state: {
		variant: 'dark',
		text: 'Hours',
		placeholder: 'Time',
		initialValue: 2
	}
}

export default HoursInputStories