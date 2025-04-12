import { useMemo } from 'react'
import Head from 'next/head'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { theme as MUIDarkTheme, lightTheme as MUILightTheme } from '../UI/styles/MUITheme.js'
import { GlobalStyles } from '@mui/material'
import { muiGlobalStyles } from '../UI/styles/globalStyles.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from 'react-redux'
import store from '../Application/store.js'
import { usePreferredTheme } from '../Application/hooks/Helpers/useClientTheme.js'

const MyApp = ({ Component, pageProps }) => {
  const { mode } = usePreferredTheme()
  const MUITheme = useMemo(() => mode === 'dark' ? MUIDarkTheme : MUILightTheme, [mode])
  return (
    <>
      <Head><title>Plan Weave</title><meta name="viewport" content="width=device-width, initial-scale=1.0" /></Head>
      <MUIThemeProvider theme={MUITheme}>
        <GlobalStyles styles={muiGlobalStyles({ theme: MUITheme })} />
        <ToastContainer position="bottom-left" autoClose={3000} />
        <Provider store={store}><Component {...pageProps} /></Provider>
      </MUIThemeProvider>
    </>
  )
}
export default MyApp