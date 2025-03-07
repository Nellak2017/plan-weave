import TableHeader from './TableHeader.js'
import { theme, lightTheme } from '../../../UI/styles/MUITheme.js'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const TableHeaderStories = {
  title: 'Atoms/Table Elements/TableHeader',
  component: TableHeader,
  argTypes: { variant: { control: 'text' }, label: { control: 'text' } }
}
const Template = args => <MUIThemeProvider theme={args?.variant === 'dark' ? theme : lightTheme}><TableHeader {...args} /></MUIThemeProvider>
export const Light = Template.bind({})
Light.args = { labels: ['Task', 'Waste', 'Eta', 'TTC'], variant: 'light' }
export const Dark = Template.bind({})
Dark.args = { labels: ['Task', 'Waste', 'Eta', 'TTC'], variant: 'dark' }
export default TableHeaderStories