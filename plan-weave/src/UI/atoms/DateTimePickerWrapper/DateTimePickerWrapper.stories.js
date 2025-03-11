import DateTimePickerWrapper from './DateTimePickerWrapper'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const DateTimePickerWrapperStories = {
	title: 'Atoms/Pickers/DateTimePicker',
	component: DateTimePickerWrapper,
	argTypes: {},
}
const LightTemplate = args => (<MUIThemeProvider theme={lightTheme}><DateTimePickerWrapper {...args} /></MUIThemeProvider>)
const DarkTemplate = args => (<MUIThemeProvider theme={theme}><DateTimePickerWrapper {...args} /></MUIThemeProvider>)

export const Light = LightTemplate.bind({})
Light.args = {}
export const Dark = DarkTemplate.bind({})
Dark.args = {}
export default DateTimePickerWrapperStories