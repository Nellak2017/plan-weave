import NextButton from './NextButton.js'

const NextButtonStories = {
  title: 'Atoms/Buttons/NextButton',
  component: NextButton,
  argTypes: { variant: { control: 'text' }, size: { control: 'text' }, }
}

const Template = args => <NextButton {...args} />
export const NextButtonLeft = Template.bind({})
NextButtonLeft.args = { variant: 'left', }
export const NextButtonRight = Template.bind({})
NextButtonRight.args = { variant: 'right', }
export default NextButtonStories