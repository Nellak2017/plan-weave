import SearchBar from './SearchBar'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const SearchBarStories = {
  title: 'Atoms/Input/SearchBar',
  component: SearchBar,
  argTypes: {
    variant: { control: 'text' },
  },
}
const Template = args => <MUIThemeProvider theme={args?.state?.variant === 'dark' ? theme : lightTheme}><SearchBar {...args} /></MUIThemeProvider>
export const LightSearchBar = Template.bind({})
LightSearchBar.args = { state: { variant: 'light' },}
export const DarkSearchBar = Template.bind({})
DarkSearchBar.args = { state: { variant: 'dark' },}
export default SearchBarStories