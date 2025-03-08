import InfoSection from './InfoSection'
import { body } from '../../../Infra/Data/HomePage/Data.js'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const InfoSectionStories = {
	title: 'Molecules/InfoSection',
	component: InfoSection,
	argTypes: { variant: { control: 'text' }, },
}
const Template = args => <MUIThemeProvider theme={args?.state?.variant === 'dark' ? theme : lightTheme}><InfoSection {...args} /></MUIThemeProvider>
export const Light = Template.bind({})
Light.args = { state: { variant: 'light', data: body[1] } }
export const Dark = Template.bind({})
Dark.args = { state: { variant: 'dark', data: body[0] } }
export default InfoSectionStories