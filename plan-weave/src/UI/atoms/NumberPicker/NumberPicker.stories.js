import NumberPicker from './NumberPicker'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const NumberPickerStories = { title: 'Atoms/Pickers/NumberPicker', component: NumberPicker, argTypes: {}, }
const LightTemplate = args => <MUIThemeProvider theme={lightTheme}><NumberPicker {...args} /></MUIThemeProvider>
const DarkTemplate = args => <MUIThemeProvider theme={theme}><NumberPicker {...args} /></MUIThemeProvider>
const options = [10, 20, 30]
export const Light = LightTemplate.bind({})
Light.args = { state: { options: options } }
export const Dark = DarkTemplate.bind({})
Dark.args = { state: { options: options } }
export default NumberPickerStories