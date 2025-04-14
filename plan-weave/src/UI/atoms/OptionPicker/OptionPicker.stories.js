import OptionPicker from './OptionPicker'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const ReactSelectWrapperStories = {
	title: 'Atoms/Pickers/OptionPicker',
	component: OptionPicker,
	argTypes: { variant: { control: 'text' }, },
}
const LightTemplate = args => <MUIThemeProvider theme={lightTheme}><OptionPicker {...args} /></MUIThemeProvider>
const DarkTemplate = args => <MUIThemeProvider theme={theme}><OptionPicker {...args} /></MUIThemeProvider>
const options = [
	{ value: 'predecessor1', label: 'Predecessor 1' },
	{ value: 'predecessor2', label: 'Predecessor 2' },
]
export const Light = LightTemplate.bind({})
Light.args = { state: { options }, }
export const Dark = DarkTemplate.bind({})
Dark.args = {
	state: { options, },
	onChange: selectedOptions => console.log(selectedOptions),
	defaultValue: options,
}
export default ReactSelectWrapperStories