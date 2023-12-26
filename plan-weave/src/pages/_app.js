import store from '../redux/store.js'
import { Provider } from 'react-redux'

import GlobalStyle from '../styles/globalStyles.js'
import { ThemeProvider, StyleSheetManager } from 'styled-components'
import theme from '../styles/theme.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import isPropValid from '@emotion/is-prop-valid' // automatic unknown prop filtering
import PropTypes from 'prop-types'

function MyApp({ Component, pageProps }) {
  return (
    <StyleSheetManager shouldForwardProp={prop => isPropValid(prop)}>
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
