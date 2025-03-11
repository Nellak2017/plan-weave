import HoursInput, { HoursInputPositiveFloat, HoursInputPositiveInt } from './HoursInput'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const HoursInputStories = {
	title: 'Atoms/input/HoursInput',
	component: HoursInput,
	argTypes: {
		placeholder: { control: 'text' },
		text: { control: 'text' },
		color: { control: 'text' },
		maxwidth: { control: 'number' },
		initialValue: { control: 'number' }
	},
}
const LightTemplate = args => <MUIThemeProvider theme={lightTheme}><HoursInput {...args} /></MUIThemeProvider>
const DarkTemplate = args => <MUIThemeProvider theme={theme}><HoursInput {...args} /></MUIThemeProvider>
const PosFloatTemplate = args => <HoursInputPositiveFloat {...args} />
const PosIntTemplate = args => <HoursInputPositiveInt {...args} />
export const Light = LightTemplate.bind({})
Light.args = { state: { text: 'Hours', } }
export const Dark = DarkTemplate.bind({})
Dark.args = { state: { text: 'Hours', placeholder: 'Time', precision: 0, pattern: /^\d*$/, }, defaultValue: 2, }
export const PositiveFloat = PosFloatTemplate.bind({})
PositiveFloat.args = { state: { text: 'Hours', } }
export const PositiveInt = PosIntTemplate.bind({})
PositiveInt.args = { state: { text: 'Hours', } }

export default HoursInputStories