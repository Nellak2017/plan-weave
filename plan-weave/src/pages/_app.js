import store from '../Application/redux/store.js'
import { Provider } from 'react-redux'
import Head from 'next/head'

import GlobalStyle from '../UI/styles/globalStyles.js'
import { ThemeProvider, StyleSheetManager } from 'styled-components'
import theme from '../UI/styles/theme.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import isPropValid from '@emotion/is-prop-valid' // automatic unknown prop filtering
import PropTypes from 'prop-types'

// eslint-disable-next-line camelcase
import { Poppins, Courier_Prime, Roboto } from 'next/font/google'

const poppins = Poppins({
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

const courierPrime = Courier_Prime({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

const roboto = Roboto({
  weight: ['500'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
})

// TODO: When you add support for light/dark mode, see the NutriSync project to add support for initial variant regardless of page

function MyApp({ Component, pageProps }) {
  return (
    <StyleSheetManager shouldForwardProp={prop => isPropValid(prop)}>
      <Head>
        <title>Plan Weave</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          :root {
            --font-poppins: ${poppins.style.fontFamily};
            --font-courier-prime: ${courierPrime.style.fontFamily};
            --font-roboto: ${roboto.style.fontFamily};
          }
          html {
            height: 100vh;
            width: 100vw;
            font-family: ${poppins.style.fontFamily}, ${courierPrime.style.fontFamily}, ${roboto.style.fontFamily}, 'Source Sans Pro', 'sans-serif';
          }
        `}</style>
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ToastContainer position="bottom-left" autoClose={3000} />
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </StyleSheetManager>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
}

export default MyApp
