// eslint-disable-next-line camelcase
import { Poppins, Courier_Prime, Roboto } from 'next/font/google'
const poppins = Poppins({ weight: ['300', '400', '700'], style: ['normal', 'italic'], subsets: ['latin'], display: 'swap', })
const courierPrime = Courier_Prime({ weight: ['400', '700'], style: ['normal', 'italic'], subsets: ['latin'], display: 'swap', })
const roboto = Roboto({ weight: ['500'], style: ['normal'], subsets: ['latin'], display: 'swap', })

export const muiGlobalStyles = ({ theme }) => ({
    ':root': { '--font-poppins': `${poppins.style.fontFamily}`, '--font-courier-prime': `${courierPrime.style.fontFamily}`, '--font-roboto': `${roboto.style.fontFamily}`, },
    html: { height: '100vh', width: '100vw', fontFamily: `${poppins.style.fontFamily}, ${courierPrime.style.fontFamily}, ${roboto.style.fontFamily}, 'Source Sans Pro', 'sans-serif'` },
    // The above styles are for the font optimization whatever
    '*': { boxSizing: 'border-box', margin: 0, padding: 0, '::selection, ::-moz-selection': { background: theme.palette.primary.main, color: theme.palette.text.primary, }, },
    'a': { textDecoration: 'none', },
    'body': { margin: 0, padding: 0, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, overflowX: 'hidden', },
    '*::-webkit-scrollbar': { width: '1em', },
    '*::-webkit-scrollbar-track': { WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)', },
    '*::-webkit-scrollbar-thumb': { backgroundColor: 'darkgrey', outline: '1px solid slategrey', },
    'p, input, button, li, a, span': { color: theme.palette.text.primary, },
    'input, li, a:hover': { color: theme.palette.text.primary, boxShadow: theme.shadows[1], },
    'button': { backgroundColor: theme.palette.primary.main, padding: `${theme.spacing(1)} ${theme.spacing(2)}`, borderRadius: theme.spacing(1), outline: 'none', border: '0px solid transparent', },
    'button:hover': { backgroundColor: theme.palette.action.hover, boxShadow: theme.shadows[2], cursor: 'pointer', },
    'input': { backgroundColor: theme.palette.background.paper, borderRadius: theme.spacing(2), padding: theme.spacing(2), outline: 'none', border: '0px solid transparent', color: theme.palette.text.primary, },
    'input:hover': { backgroundColor: theme.palette.action.hover, },
    '.icon': { margin: 0, padding: 0, color: theme.palette.text.primary, }, '.icon:hover': { transition: '350ms', cursor: 'pointer', color: theme.palette.primary.main, },
})