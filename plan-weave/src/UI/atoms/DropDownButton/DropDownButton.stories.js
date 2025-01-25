import DropDownButton from './DropDownButton'

const DropDownButtonStories = {
  title: 'Atoms/Buttons/DropDownButton',
  component: DropDownButton,
  argTypes: {}
}

const Template = args => <DropDownButton {...args} />

const options = [
  { name: 'Option 1', listener: () => console.log('Option 1 clicked') },
  { name: 'Option 2', listener: () => console.log('Option 2 clicked') },
  { name: 'Option 3', listener: () => console.log('Option 3 clicked') },
]

export const DropDownButtonStory = Template.bind({})
DropDownButtonStory.args = {
  children: 'Auto Sort',
  options
}

export default DropDownButtonStories