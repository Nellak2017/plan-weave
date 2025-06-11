import { styled } from '@mui/system'

export const AuthContainer = styled('div')(({ theme, maxwidth }) => ({
	margin: 'auto', padding: `${theme.spacing(2)} 0`,
	display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', rowGap: theme.spacing(2),
	borderRadius: theme.spacing(3), maxWidth: `${maxwidth}px`, width: '100%',
	color: theme.palette.text.primary, backgroundColor: theme.palette.background.paperBackground, boxShadow: theme.shadows[3],
	'& a': { color: theme.palette.primary.main }, '& a:hover, h2, h3, p, label, span': { color: theme.palette.text.primary },
	'& input': { boxShadow: theme.shadows[2] }, '& section': { backgroundColor: theme.palette.background.paperBackground, },
	'& .logo': { background: 'transparent', filter: theme.logoFilter }
}))
export const StyledAuthForm = styled('form')(({ theme }) => ({
	display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', rowGap: theme.spacing(2), width: '100%', '& button': { width: '80%' },
	'& h2': { fontSize: theme.typography.h3.fontSize }, img: { borderRadius: '20%', cursor: 'pointer', },
}))
export const InputSection = styled('div')(({ theme }) => ({
	display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', rowGap: theme.spacing(1), width: '100%',
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
export const CenteredContainer = styled('div')(() => ({ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', '& button:hover, a:hover': { boxShadow: 'none' }}))
export const SubtitleContainer = styled('div')(({ theme }) => ({ display: 'flex', columnGap: theme.spacing(2), a: { textDecoration: 'underline' }, }))
export const ForgotPasswordButton = styled('button')(({ theme }) => ({ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', font: 'inherit', '&:hover': { background: 'none', color: theme.palette.primary.main, }}))