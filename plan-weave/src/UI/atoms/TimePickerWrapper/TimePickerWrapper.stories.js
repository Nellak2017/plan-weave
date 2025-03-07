import TimePickerWrapper from './TimePickerWrapper'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const TimePickerWrapperStories = {
  title: 'Atoms/Pickers/TimePicker',
  component: TimePickerWrapper,
  argTypes: { variant: { control: 'text' }, defaultTime: { control: 'text' } }
}
const Template = args => <MUIThemeProvider theme={args?.variant === 'dark' ? theme : lightTheme}><TimePickerWrapper {...args} /></MUIThemeProvider>
export const Light = Template.bind({})
Light.args = { variant: 'light' }
export const Dark = Template.bind({})
Dark.args = { variant: 'dark' }
export default TimePickerWrapperStories