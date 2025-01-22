import DropDownButton from './DropDownButton'

const DropDownButtonStories = {
  title: 'Atoms/Buttons/DropDownButton',
  component: DropDownButton,
  argTypes: {
    size: { control: 'text' },
    color: { control: 'text' },
  }
}

const Template = args => <DropDownButton {...args} />

const options = [
  { name: 'Option 1', listener: () => console.log('Option 1 clicked') },
  { name: 'Option 2', listener: () => console.log('Option 2 clicked') },
  { name: 'Option 3', listener: () => console.log('Option 3 clicked') },
]

export const DropDownButtonStory = Template.bind({})
DropDownButton.args = {
  children: 'Auto Sort',
  color: 'primary',
  options: options
}

export default DropDownButtonStories