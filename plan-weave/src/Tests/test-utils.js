import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import theme from '../UI/styles/theme.js' // TODO: Remove UI layer dependency
import GlobalStyle from '../UI/styles/globalStyles.js' // TODO: Remove UI layer dependency
import { ToastContainer } from 'react-toastify'
import { setupStore } from '../Application/redux/store.js'
// TODO: Move test-utils.js to Test folder
const defaultOptions = {} // we used to do stuff here now not
const Wrapper = ({ children, store }) => (
	<ThemeProvider theme={theme}>
		<GlobalStyle />
		<ToastContainer position="bottom-left" autoClose={3000} />
		<Provider store={store}>{children}</Provider>
	</ThemeProvider>
)
export const renderWithProviders = (ui, { preloadedState = {}, store = setupStore(preloadedState) } = defaultOptions,) => ({ store, ...render(ui, { wrapper: (props) => <Wrapper {...props} store={store} />, }) })
// https://www.freecodecamp.org/news/how-to-write-unit-tests-in-react-redux/