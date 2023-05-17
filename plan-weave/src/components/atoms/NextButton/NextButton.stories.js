import NextButton from './NextButton.js'

export default {
  title: 'Atoms/Buttons/NextButton',
  component: NextButton,
  argTypes: {
	variant: {control: 'text'},
    size: { control: 'text' },
    color: { control: 'text' },
  }
}

const Template = args => <NextButton {...args} />

export const nextButtonLeft = Template.bind({})
nextButtonLeft.args = {
	variant: 'left',
  	color: 'primary',
}

export const nextButtonRight = Template.bind({})
nextButtonRight.args = {
	variant: 'right',
  	color: 'primary'
}