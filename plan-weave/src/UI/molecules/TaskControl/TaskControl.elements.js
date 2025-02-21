import { styled } from '@mui/system'

const variantStyle = ({ bg, color, italicBg }) => ({
	backgroundColor: bg, color, p: { color },
	'pan > p, span > svg': {
		color, fontSize: '16px', //${props => props.theme.fontSizes.medium};
	},
	i: { backgroundColor: italicBg }
})
const taskControlPresets = variant => ({
	light: variantStyle({ bg: '#eeedee', color: '#39313a', italicBg: '#c9c6c9' }),// variantStyle({ bg: props => props.theme.colors.lightNeutralLight, color: props => props.theme.colors.darkNeutral, italicBg: props => props.theme.colors.lightNeutralLightActive }),
	dark: variantStyle({ bg: '#2b252c', color: '#eeedee', italicBg: '#c2bfc2' }), // variantStyle({ bg: props => props.theme.colors.darkNeutralDark, color: props => props.theme.colors.lightNeutralLight, italicBg: props => props.theme.colors.darkNeutralLightActive }),
}?.[variant])
export const TaskControlContainer = styled('div')(({ theme, variant, maxwidth }) => ({
	display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'column',
	minHeight: '56px', // ${props => props.theme.spaces.extraLarge};
	width: '100%', maxWidth: `${maxwidth}px`, borderRadius: '36px 36px 0 0',
	paddingLeft: '4px', // ${props => props.theme.spaces.smaller};
	'svg': {
		cursor: 'pointer', borderRadius: '50%',
		'&:hover': {
			color: theme.palette.primary.main, // ${props => props.theme.colors.primary};
			boxShadow: '0px 1px 8px 0px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 3px 3px -2px rgba(0, 0, 0, 0.12)',// ${props => props.theme.elevations.small};
		}
	},
	...taskControlPresets(variant)
}))

export const TopContainer = styled('div')(({ theme, maxwidth }) => ({
	display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row',
	height: '56px', // ${props => props.theme.spaces.extraLarge};
	width: '100%', maxWidth: `${maxwidth}px`, borderRadius: '36px 36px 0 0',
	paddingTop: '8px',//${props => props.theme.spaces.small};
	paddingLeft: '16px',//${props => props.theme.spaces.medium};
	paddingRight: '16px',//${props => props.theme.spaces.medium};
	'& > p': { fontSize: '24px', },// ${props => props.theme.fontSizes.large};}
}))

export const BottomContainer = styled('div')(({ theme, maxwidth }) => ({
	display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row',
	width: '100%', maxWidth: `${maxwidth}px`, borderRadius: '36px 36px 0 0',
	paddingLeft: '16px',//${props => props.theme.spaces.medium};
	paddingRight: '16px',//${props => props.theme.spaces.medium};
}))

export const BottomContentContainer = styled('span')(({ theme }) => ({
	display: 'inline-flex', alignItems: 'center', flexDirection: 'row',
	fontSize: '16px', // ${props => props.theme.fontSizes.medium};
	columnGap: '8px',// ${props => props.theme.spaces.small};
	paddingBottom: '8px',// ${props => props.theme.spaces.small};
}))
export const Separator = styled('i')(({ theme, variant }) => ({
	width: '1px',
	height: '24px',// ${props => props.theme.fontSizes.large};
	margin: '0 5px',
	...taskControlPresets(variant)
}))
export const TimePickerContainer = styled('div')(() => ({ display: 'flex', columnGap: '8px',}))