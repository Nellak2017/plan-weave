import SearchBar from './SearchBar'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const SearchBarStories = { title: 'Atoms/Input/SearchBar', component: SearchBar, }
const LightTemplate = args => <MUIThemeProvider theme={lightTheme}><SearchBar {...args} /></MUIThemeProvider>
const DarkTemplate = args => <MUIThemeProvider theme={theme}><SearchBar {...args} /></MUIThemeProvider>
export const LightSearchBar = LightTemplate.bind({})
LightSearchBar.args = {}
export const DarkSearchBar = DarkTemplate.bind({})
DarkSearchBar.args = {}
export default SearchBarStories