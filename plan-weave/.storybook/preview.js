import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { theme as MUITheme } from '../src/UI/styles/MUITheme.js'
import { GlobalStyles } from '@mui/material'
import { muiGlobalStyles } from '../src/UI/styles/globalStyles.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

const config = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/, }, },
    viewport: { viewports: INITIAL_VIEWPORTS, },
  },
  decorators: [
    Story => (
      <MUIThemeProvider theme={MUITheme}>
        <GlobalStyles styles={muiGlobalStyles({ theme: MUITheme })} />
        <ToastContainer position="bottom-left" autoClose={3000} />
        <Story />
      </MUIThemeProvider>
    )
  ]
}
export default config