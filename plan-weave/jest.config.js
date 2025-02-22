const testConfig = {
	clearMocks: true, testEnvironment: "jsdom",
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
	transformIgnorePatterns: ["node_modules/(?!(rescript)/)"],
}
module.exports = testConfig