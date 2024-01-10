import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import theme from '../../styles/theme.js'
import PropTypes from 'prop-types'
import { setupStore } from '../../redux/store'

export function renderWithProviders(
	ui,
	{
		preloadedState = {},
		// Automatically create a store instance if no store was passed in
		store = setupStore(preloadedState),
		...renderOptions
	} = {}
) {
	function Wrapper({ children }) {
		return (
			<Provider store={store}>
				<ThemeProvider theme={theme}>
					{children}
				</ThemeProvider>
			</Provider>
		)
	}

	Wrapper.propTypes = {
		children: PropTypes.any
	}

	// Return an object with the store and all of RTL's query functions
	return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

renderWithProviders.propTypes = {
	ui: PropTypes.node.isRequired,
	preloadedState: PropTypes.object,
	store: PropTypes.object,
	renderOptions: PropTypes.object,
}