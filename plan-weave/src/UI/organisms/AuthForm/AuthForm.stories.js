import AuthForm from './AuthForm'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { AUTH_FORM_TYPES } from '../../../Core/utils/constants.js'

const AuthFormStories = { title: 'Organisms/AuthForm', component: AuthForm, argTypes: {}, }
const LightTemplate = args => <MUIThemeProvider theme={lightTheme}><AuthForm {...args} /></MUIThemeProvider>
const DarkTemplate = args => <MUIThemeProvider theme={theme}><AuthForm {...args} /></MUIThemeProvider>
const ForgotPasswordTemplate = args => <MUIThemeProvider theme={theme}><AuthForm {...args} /></MUIThemeProvider>
const ResetPasswordTemplate = args => <MUIThemeProvider theme={theme}><AuthForm {...args} /></MUIThemeProvider>
export const Light = LightTemplate.bind({})
Light.args = {}
export const Dark = DarkTemplate.bind({})
Dark.args = { type: AUTH_FORM_TYPES.signUpOption }
export const ForgotPassword = ForgotPasswordTemplate.bind({})
ForgotPassword.args = { type: AUTH_FORM_TYPES.forgotPasswordOption }
export const ResetPassword = ResetPasswordTemplate.bind({})
ResetPassword.args = { type: AUTH_FORM_TYPES.resetPasswordOption }
export default AuthFormStories