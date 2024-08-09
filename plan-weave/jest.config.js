const testConfig = {
	clearMocks: true,
	//collectCoverage: true,
	testEnvironment: "jsdom",
	transform: {
		"^.+\\.(t|j)sx?$": [
			"@swc/jest",
			{
				"jsc": {
					"parser": {
						"syntax": "ecmascript",
						"jsx": true,
						"decorators": false,
						"dynamicImport": false
					}
				}
			}
		]
	},
	transformIgnorePatterns: [
		"node_modules/(?!(rescript)/)"
	],
	moduleNameMapper: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/__mocks__/fileMock.js',
		'\\.(css|less)$': 'identity-obj-proxy',
		'styled-components': 'styled-components/dist/styled-components.browser.cjs.js',
	}, // https://jestjs.io/docs/webpack#mocking-css-modules
	// https://github.com/styled-components/styled-components/issues/4081
}

module.exports = testConfig
