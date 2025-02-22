import { styled } from '@mui/system'
const getVariant = ({ theme, variant }) => ({
	light: { h1: { color: '#504651' }, }, // ${props => props.theme.colors.lightNeutral}
	dark: { h1: { color: '#eeedee' }, }, // ${props => props.theme.colors.lightNeutralLight}
}?.[variant])
export const StyledTaskEditor = styled('div')(({ theme, variant, maxwidth }) => ({
	width: '100%', maxWidth: `${maxwidth}px`, borderRadius: '36px', backgroundColor: 'black', // Stand-in color
	...getVariant({ theme, variant })
}))
export const TaskEditorContainer = styled('section')(({ theme, variant }) => ({
	display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
	h1: { fontWeight: 300, fontSize: '40px', }, // ${props => props.theme.fontSizes.larger}
	...getVariant({ theme, variant })
}))