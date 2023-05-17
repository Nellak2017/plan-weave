import theme from '../src/styles/theme.js'
import GlobalStyle from '../src/styles/globalStyles.js'
import { ThemeProvider } from 'styled-components'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

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
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Story />
      </ThemeProvider>
    )
  ]
}