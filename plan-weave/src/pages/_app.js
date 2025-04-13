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
import { useLocalStorage } from '../Application/hooks/Helpers/useLocalStorage.js'

const MyApp = ({ Component, pageProps }) => {
  const { value } = useLocalStorage('themeMode')
  const MUITheme = useMemo(() => value === 'dark' ? MUIDarkTheme : MUILightTheme, [value])
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