import TableHeader from './TableHeader.js'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const TableHeaderStories = {
  title: 'Atoms/Table Elements/TableHeader',
  component: TableHeader,
  argTypes: { label: { control: 'text' } }
}
const LightTemplate = args => <MUIThemeProvider theme={lightTheme}><TableHeader {...args} /></MUIThemeProvider>
const DarkTemplate = args => <MUIThemeProvider theme={theme}><TableHeader {...args} /></MUIThemeProvider>
export const Light = LightTemplate.bind({})
Light.args = { labels: ['Task', 'Waste', 'Eta', 'TTC'] }
export const Dark = DarkTemplate.bind({})
Dark.args = { labels: ['Task', 'Waste', 'Eta', 'TTC'] }
export default TableHeaderStories