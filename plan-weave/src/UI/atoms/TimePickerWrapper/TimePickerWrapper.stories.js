import TimePickerWrapper from './TimePickerWrapper'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const TimePickerWrapperStories = {
  title: 'Atoms/Pickers/TimePicker',
  component: TimePickerWrapper,
  argTypes: { defaultTime: { control: 'text' } }
}
const LightTemplate = args => <MUIThemeProvider theme={lightTheme}><TimePickerWrapper {...args} /></MUIThemeProvider>
const DarkTemplate = args => <MUIThemeProvider theme={theme}><TimePickerWrapper {...args} /></MUIThemeProvider>
export const Light = LightTemplate.bind({})
Light.args = {}
export const Dark = DarkTemplate.bind({})
Dark.args = {}
export default TimePickerWrapperStories