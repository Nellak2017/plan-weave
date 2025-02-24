import HoursInput, { HoursInputPositiveFloat, HoursInputPositiveInt } from './HoursInput'

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
const PosFloatTemplate = args => <HoursInputPositiveFloat {...args} />
const PosIntTemplate = args => <HoursInputPositiveInt {...args} />
export const Light = Template.bind({})
Light.args = { state: { variant: 'light', text: 'Hours', } }
export const Dark = Template.bind({})
Dark.args = { state: { variant: 'dark', text: 'Hours', placeholder: 'Time', precision: 0, pattern: /^\d*$/, }, defaultValue: 2,}
export const PositiveFloat = PosFloatTemplate.bind({})
PositiveFloat.args = { state: { variant: 'light', text: 'Hours', } }
export const PositiveInt = PosIntTemplate.bind({})
PositiveInt.args = { state: { variant: 'dark', text: 'Hours', } }

export default HoursInputStories