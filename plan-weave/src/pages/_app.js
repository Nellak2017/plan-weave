import GlobalStyle from '../styles/globalStyles.js'
import { ThemeProvider } from 'styled-components'
import theme from '../styles/theme.js'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
