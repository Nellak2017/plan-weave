import Pagination from './Pagination'
import { calcMaxPage } from '../../../Core/utils/helpers'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const PaginationStories = {
	title: 'Molecules/Pagination',
	component: Pagination,
	argTypes: { variant: { control: 'text' }, },
}
const LightTemplate = args => <MUIThemeProvider theme={lightTheme}><Pagination {...args} /></MUIThemeProvider>
const DarkTemplate = args => <MUIThemeProvider theme={theme}><Pagination {...args} /></MUIThemeProvider>
export const Light = LightTemplate.bind({})
Light.args = { customHook: () => ({ childState: { variant: 'light' }}),}
export const Dark = DarkTemplate.bind({})
Dark.args = {
	customHook: () => ({
		childState: {
			variant: 'dark',
			maxPage: calcMaxPage(21, 10), // If you want more interactivity, you have to make a full-blown custom hook
			localPageNumber: 1,
			tasksPerPage: 21,
		} 
	})
}
export default PaginationStories