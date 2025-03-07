import NumberPicker from './NumberPicker'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const NumberPickerStories = {
	title: 'Atoms/Pickers/NumberPicker',
	component: NumberPicker,
	argTypes: { variant: { control: 'text' }, },
}

const Template = args => <MUIThemeProvider theme={args?.state?.variant === 'dark' ? theme : lightTheme}><NumberPicker {...args} /></MUIThemeProvider>
const options = [10, 20, 30]
export const Light = Template.bind({})
Light.args = { state: { variant: 'light', options: options } }
export const Dark = Template.bind({})
Dark.args = { state: { variant: 'dark', options: options } }
export default NumberPickerStories