import SearchBar from './SearchBar'

export default {
  title: 'Atoms/SearchBar',
  component: SearchBar,
  argTypes: {
    variant: { control: 'text' },
  },
}

const Template = args => <SearchBar {...args} />

export const lightSearchBar = Template.bind({})
lightSearchBar.args = {
  variant: 'light',
}

export const darkSearchBar = Template.bind({})
darkSearchBar.args = {
  variant: 'dark',
}