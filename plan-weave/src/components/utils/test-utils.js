import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import theme from '../../styles/theme.js'
import GlobalStyle from '../../styles/globalStyles.js'
import { ToastContainer } from 'react-toastify'
import PropTypes from 'prop-types'
import { setupStore } from '../../redux/store.js'

const defaultOptions = {} // we used to do stuff here now not

const Wrapper = ({ children, store }) => (
	<ThemeProvider theme={theme}>
		<GlobalStyle />
		<ToastContainer position="bottom-left" autoClose={3000} />
		<Provider store={store}>
			{children}
		</Provider>
	</ThemeProvider>
)

export const renderWithProviders = (
	ui,
	{ preloadedState = {}, store = setupStore(preloadedState) } = defaultOptions,
) => (
	{
		store,
		...render(ui, { wrapper: (props) => <Wrapper {...props} store={store} />, })
		//...render(ui, { wrapper: Wrapper, ...renderOptions })
	}
)
// https://www.freecodecamp.org/news/how-to-write-unit-tests-in-react-redux/

Wrapper.propTypes = {
	children: PropTypes.any,
	store: PropTypes.object.isRequired
}

renderWithProviders.propTypes = {
	ui: PropTypes.node.isRequired,
	preloadedState: PropTypes.object,
	store: PropTypes.object,
	renderOptions: PropTypes.object,
}