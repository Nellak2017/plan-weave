import theme from '../src/components/styles/theme.js' //'../src/styles/theme.js'
import GlobalStyle from '../src/styles/globalStyles.js'
import { ThemeProvider, StyleSheetManager } from 'styled-components'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import isPropValid from '@emotion/is-prop-valid'

// Storybook 7 syntax for parameters and decorators
// See also: https://storybook.js.org/docs/react/writing-stories/parameters
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
        <ThemeProvider theme={theme}>
          <ToastContainer position="bottom-left" autoClose={3000} />
          <GlobalStyle />
          <Story />
        </ThemeProvider>
      </StyleSheetManager>
    )
  ]
}