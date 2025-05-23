import AuthForm from './AuthForm'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const AuthFormStories = { title: 'Organisms/AuthForm', component: AuthForm, argTypes: {}, }
const LightTemplate = args => <MUIThemeProvider theme={lightTheme}><AuthForm {...args} /></MUIThemeProvider>
const DarkTemplate = args => <MUIThemeProvider theme={theme}><AuthForm {...args} /></MUIThemeProvider>
export const Light = LightTemplate.bind({})
Light.args = {}
export const Dark = DarkTemplate.bind({})
Dark.args = { signup: { signup: true } }
export default AuthFormStories