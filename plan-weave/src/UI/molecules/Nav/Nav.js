import { StyledNav, ContentContainer } from './Nav.elements'
import { LeftContent, MiddleContent, RightContent } from './Nav.slots'

export const Nav = ({ slots: { left = <LeftContent />, middle = <MiddleContent />, right = <RightContent />, } = {} }) => (
	<StyledNav><ContentContainer>{left}{middle}{right}</ContentContainer></StyledNav>
)
export default Nav