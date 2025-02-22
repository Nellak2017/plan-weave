// eslint-disable-next-line camelcase
import { Poppins, Courier_Prime, Roboto } from 'next/font/google'
const poppins = Poppins({ weight: ['300', '400', '700'], style: ['normal', 'italic'], subsets: ['latin'], display: 'swap', })
const courierPrime = Courier_Prime({ weight: ['400', '700'], style: ['normal', 'italic'], subsets: ['latin'], display: 'swap', })
const roboto = Roboto({ weight: ['500'], style: ['normal'], subsets: ['latin'], display: 'swap', })

export const muiGlobalStyles = ({ theme }) => ({
    ':root': { '--font-poppins': `${poppins.style.fontFamily}`, '--font-courier-prime': `${courierPrime.style.fontFamily}`, '--font-roboto': `${roboto.style.fontFamily}`, },
    html: { height: '100vh', width: '100vw', fontFamily: `${poppins.style.fontFamily}, ${courierPrime.style.fontFamily}, ${roboto.style.fontFamily}, 'Source Sans Pro', 'sans-serif'` },
    // The above styles are for the font optimization whatever
    '*': {
        boxSizing: 'border-box', margin: 0, padding: 0,
        '::-moz-selection': { background: theme.palette.primary.main, color: '#eeedee', }, // lightNeutralLight,
        '::selection': { background: theme.palette.primary.main, color: '#eeedee', }, // lightNeutralLight,
    },
    'a': { textDecoration: 'none', },
    'body': {
        margin: 0, padding: 0,
        backgroundColor: '#39313a',// body,
        color: '#f4f0ff', //defaultFontColor,
        overflowX: 'hidden', // Prevent horizontal scrollbar
    },
    '*::-webkit-scrollbar': { width: '1em', },
    '*::-webkit-scrollbar-track': { WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)', },
    '*::-webkit-scrollbar-thumb': { backgroundColor: 'darkgrey', outline: '1px solid slategrey', },
    'p, input, button, li, a, span': { color: '#f4f0ff', }, // defaultFontColor,
    'input, li, a:hover': {
        color: '#f4f0ff', // defaultFontColor,
        boxShadow: theme.shadows[1], // small elevation for hover effect
    },
    'button': { backgroundColor: theme.palette.primary.main, padding: `${theme.spacing(1)} ${theme.spacing(2)}`, borderRadius: theme.spacing(1), outline: 'none', border: '0px solid transparent', },
    'button:hover': {
        backgroundColor: '#6031ed', // primaryHover
        boxShadow: theme.shadows[2], cursor: 'pointer',
    },
    'input': {
        backgroundColor: '#504651', // lightNeutral,
        borderRadius: theme.spacing(2), padding: theme.spacing(2), outline: 'none', border: '0px solid transparent', color: '#f4f0ff', // defaultFontColor,
    },
    'input:hover': { backgroundColor: '#483f49', }, // lightNeutralHover,
    '.icon': { margin: 0, padding: 0, color: '#f4f0ff', }, // defaultFontColor,
    '.icon:hover': { transition: '350ms', cursor: 'pointer', color: '#e2d9fc', },// primaryLightHover
})