import theme from '../src/UI/styles/theme.js'
import GlobalStyle from '../src/UI/styles/globalStyles.js'
import { ThemeProvider, StyleSheetManager } from 'styled-components'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import isPropValid from '@emotion/is-prop-valid'

import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline' // normalizes css for MUI
import { theme as MUITheme } from '../src/UI/styles/MUITheme.js'

export default {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
  // Wrap every story in the story book with a ThemeProvider and the GlobalStyles
  decorators: [
    (Story) => (
      <StyleSheetManager shouldForwardProp={prop => isPropValid(prop)}>
        <MUIThemeProvider theme={MUITheme}>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <ToastContainer position="bottom-left" autoClose={3000} />
            <GlobalStyle />
            <Story />
          </ThemeProvider>
        </MUIThemeProvider>
      </StyleSheetManager>
    )
  ]
}