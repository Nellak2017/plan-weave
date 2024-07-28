import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import theme from '../../styles/theme.js'
import GlobalStyle from '../../styles/globalStyles.js'
import { ToastContainer } from 'react-toastify'
import PropTypes from 'prop-types'

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

export const renderWithProviders = (ui, store, options = defaultOptions) =>
	render(ui, { wrapper: (props) => <Wrapper {...props} store={store}>{ui}</Wrapper>, ...options })


Wrapper.propTypes = {
	children: PropTypes.any
}

renderWithProviders.propTypes = {
	ui: PropTypes.node.isRequired,
	preloadedState: PropTypes.object,
	store: PropTypes.object,
	renderOptions: PropTypes.object,
}