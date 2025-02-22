import { styled } from '@mui/system'

const getVariantStyle = ({ variant, theme }) => ({
	light: {
		color: '#504651',//${props => props.theme.colors.lightNeutral};
		backgroundColor: '#eeedee',//${props => props.theme.colors.lightNeutralLight};
		boxShadow: '0px 1px 8px 0px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 3px 3px -2px rgba(0, 0, 0, 0.12)', // ${props => props.theme.elevations.small};
		'& a': { color: theme.palette.primary.main },
		'& a:hover': { color: '#2b252c' }, // ${props => props.theme.colors.darkNeutralDark}
		'& h2, h3, p, label': { color: '#504651' }, // ${props => props.theme.colors.lightNeutral}
		'& input': { boxShadow: '0px 1px 8px 0px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 3px 3px -2px rgba(0, 0, 0, 0.12)' }, // ${props => props.theme.elevations.small}
		'& section': { backgroundColor: '#c9c6c9' }, // ${props => props.theme.colors.lightNeutralLightActive}
		'& span': { color: '#504651' }, // ${props => props.theme.colors.lightNeutral}
		'& .logo': { background: 'transparent', filter: 'invert(100 %) brightness(0%) invert(11%) sepia(7%) saturate(1281 %)hue - rotate(245deg) brightness(101 %) contrast(89 %)', }
	},
	dark: {
		color: '#eeedee',//${props => props.theme.colors.lightNeutralLight};
		backgroundColor: '#2b252c',//${props => props.theme.colors.darkNeutralDark};
		boxShadow: '0px 1px 8px 0px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 3px 3px -2px rgba(0, 0, 0, 0.12)', //${props => props.theme.elevations.small};
		'& a': { color: '#b7a1f7' }, // ${props => props.theme.colors.primaryLightActive}
		'& a:hover': { color: '#e2d9fc' }, //  ${props => props.theme.colors.primaryLightHover}
		'& h2, h3, p, label': { color: '#eeedee' }, // ${props => props.theme.colors.lightNeutralLight}
		'& input': { boxShadow: '0px 1px 8px 0px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 3px 3px -2px rgba(0, 0, 0, 0.12)' }, // ${ props => props.theme.elevations.small}
		'& section': { backgroundColor: '#c9c6c9' }, // ${ props => props.theme.colors.lightNeutralLightActive }
		'& span': { color: '#eeedee' }, // ${ props => props.theme.colors.lightNeutralLight }
	},
}?.[variant])
export const AuthContainer = styled('div')(({ theme, variant, maxwidth }) => ({
	margin: 'auto', padding: `${'8px'} 0`, // ${props => props.theme.spaces.small}
	display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', rowGap: '8px', // ${props => props.theme.spaces.small}
	borderRadius: '16px', // ${props => props.theme.spaces.medium}
	maxWidth: `${maxwidth}px`, width: '100%',
	...getVariantStyle({ theme, variant }),
}))
export const StyledAuthForm = styled('form')(({ theme }) => ({
	display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', rowGap: '8px', // ${props => props.theme.spaces.small}
	width: '100%', '& button': { width: '80%' },
	'& h2': { fontSize: '24px' }, // ${props => props.theme.fontSizes.large}
	img: { borderRadius: '20%', cursor: 'pointer', },
}))
export const InputSection = styled('div')(({ theme }) => ({
	display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', rowGap: '4px', // row-gap: ${props => props.theme.spaces.smaller};
	width: '100%',
	'& input': { width: '80%', },
	'& label': { alignSelf: 'flex-start', marginLeft: '10%', },
}))
export const SignInContainer = styled('div')(() => ({
	display: 'flex', alignItems: 'center', justifyContent: 'center',
	width: '100%', margin: '20px 0 20px 0',
	'& button': { fontSize: '14px', width: '80%', borderRadius: '8px', },
	'& div[role=button]': { borderRadius: '8px!important', div: { borderRadius: '8px 0 0 8px!important', } }, // For the newly installed Google button
}))
export const OrSeparator = styled('span')(() => ({ display: 'flex', alignItems: 'center', textAlign: 'center', width: '80%', userSelect: 'none', }))
export const Line = styled('section')(() => ({ width: '100%', height: '1px', }))
export const Or = styled('div')(() => ({ padding: '0 10px', }))
export const CenteredContainer = styled('div')(() => ({ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', }))
export const SubtitleContainer = styled('div')(({ theme }) => ({
	display: 'flex', columnGap: '8px', // ${props => props.theme.spaces.small}
	a: { textDecoration: 'underline' },
}))