import InfoSection from './InfoSection'
import { body } from '../../../Infra/Data/HomePage/Data.js'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const InfoSectionStories = {
	title: 'Molecules/InfoSection',
	component: InfoSection,
	argTypes: { variant: { control: 'text' }, },
}
const LightTemplate = args => <MUIThemeProvider theme={lightTheme}><InfoSection {...args} /></MUIThemeProvider>
const DarkTemplate = args => <MUIThemeProvider theme={theme}><InfoSection {...args} /></MUIThemeProvider>
export const Light = LightTemplate.bind({})
Light.args = { state: { variant: 'light', data: body[1] } }
export const Dark = DarkTemplate.bind({})
Dark.args = { state: { variant: 'dark', data: body[0] } }
export default InfoSectionStories