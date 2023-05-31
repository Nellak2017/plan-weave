import TaskControl from './TaskControl';

export default {
  title: 'Molecules/TaskControl',
  component: TaskControl,
  argTypes: {
    variant: { control: 'text' },
    maxwidth: { control: 'number' },
	  maxwidthsearch: {control: 'number'},
	  color: {control: 'text'}
    // Add other argTypes for SearchBar, DropDownButton, and Date Picker props
  },
};

const Template = args => <TaskControl {...args} />;

const options = [
	{ name: 'Option 1', listener: () => console.log('Option 1 clicked') },
	{ name: 'Option 2', listener: () => console.log('Option 2 clicked') },
	{ name: 'Option 3', listener: () => console.log('Option 3 clicked') },
  ]  

export const Light = Template.bind({});
Light.args = {
  variant: 'light',
  options: options,
  x1: -36
  // Add other args for SearchBar, DropDownButton, and Date Picker
};

export const Dark = Template.bind({});
Dark.args = {
  variant: 'dark',
  options: options,
  // Add other args for SearchBar, DropDownButton, and Date Picker
};