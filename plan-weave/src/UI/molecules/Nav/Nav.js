import { LeftContent, MiddleContent, RightContent, DefaultContainer } from './Nav.slots'

export const Nav = ({ slots: { left = <LeftContent />, middle = <MiddleContent />, right = <RightContent />, container: Container = DefaultContainer } = {} }) => (
	<Container left={left} middle={middle} right={right} />
)
export default Nav