import DateTimePickerWrapper from './DateTimePickerWrapper'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const DateTimePickerWrapperStories = {
	title: 'Atoms/Pickers/DateTimePicker',
	component: DateTimePickerWrapper,
	argTypes: {},
}
const Template = args => (<MUIThemeProvider theme={args?.state?.variant === 'dark' ? theme : lightTheme}><DateTimePickerWrapper {...args} /></MUIThemeProvider>)

export const Light = Template.bind({})
Light.args = { state: { variant: 'light' }, }
export const Dark = Template.bind({})
Dark.args = { state: { variant: 'dark' }, }
export default DateTimePickerWrapperStories