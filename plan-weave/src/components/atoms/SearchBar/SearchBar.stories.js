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
LightSearchBar.args = {
  variant: 'light',
}

export const DarkSearchBar = Template.bind({})
DarkSearchBar.args = {
  variant: 'dark',
}

export default SearchBarStories