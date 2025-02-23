import InfoSection from './InfoSection'
import { body } from '../../../Infra/Data/HomePage/Data.js'

const InfoSectionStories = {
	title: 'Molecules/InfoSection',
	component: InfoSection,
	argTypes: { variant: { control: 'text' }, },
}
const Template = args => <InfoSection {...args} />
export const Light = Template.bind({})
Light.args = { state: { variant: 'light', data: body[1] } }
export const Dark = Template.bind({})
Dark.args = { state: { variant: 'dark', data: body[0] } }
export default InfoSectionStories