import MultipleDeleteButton from './MultipleDeleteButton'
import { useState } from 'react'
import { Radio, FormControlLabel } from '@mui/material'
import { getDefaultState, getFSMValue, IS_CHOOSE_ALLOWED, CHOSEN, handleMinOne, CHOOSE, handleMaxZero } from '../../../Application/finiteStateMachines/MultipleDeleteButton.fsm.js'

const MultipleDeleteButtonStories = {
  title: 'Molecules/MultipleDeleteButton',
  component: MultipleDeleteButton,
  argTypes: { variant: { control: 'text' }, },
}

const Template = args => <MultipleDeleteButton {...args} />
const TemplateWithControl = args => {
  const [fsmState, setFSMState] = useState(getDefaultState())
  const handleRadioChange = () => { fsmState === CHOOSE ? handleMinOne(setFSMState, fsmState) : handleMaxZero(setFSMState, fsmState) }
  return (
    <>
      <MultipleDeleteButton {...args} state={{ ...args.state, fsmControlledState: fsmState }} services={{ ...args.services, setControlledFSMState: setFSMState }} />
      {getFSMValue(fsmState, IS_CHOOSE_ALLOWED) && (<FormControlLabel control={<Radio checked={fsmState === CHOSEN} onClick={handleRadioChange} value="task-selection" />} label="Select Tasks" />)}
    </>
  )
}
export const Uncontrolled = Template.bind({})
Uncontrolled.args = {}
export const Controlled = TemplateWithControl.bind({})
Controlled.args = {}
export default MultipleDeleteButtonStories