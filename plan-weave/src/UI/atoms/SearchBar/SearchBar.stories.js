import SearchBar from './SearchBar'

const SearchBarStories = {
  title: 'Atoms/Input/SearchBar',
  component: SearchBar,
  argTypes: {
    variant: { control: 'text' },
  },
}
const Template = args => <SearchBar {...args} />
export const LightSearchBar = Template.bind({})
LightSearchBar.args = { state: { variant: 'light' },}
export const DarkSearchBar = Template.bind({})
DarkSearchBar.args = { state: { variant: 'dark' },}
export default SearchBarStories