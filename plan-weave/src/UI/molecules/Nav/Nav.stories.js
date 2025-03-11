import Nav from './Nav'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const NavStories = { title: 'Molecules/Nav', component: Nav, argTypes: {}, }
const LightTemplate = args => <MUIThemeProvider theme={lightTheme}><Nav {...args} /></MUIThemeProvider>
const DarkTemplate = args => <MUIThemeProvider theme={theme}><Nav {...args} /></MUIThemeProvider>
export const Light = LightTemplate.bind({})
Light.args = {}
export const Dark = DarkTemplate.bind({})
Dark.args = {}
export default NavStories