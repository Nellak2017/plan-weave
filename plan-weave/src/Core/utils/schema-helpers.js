// (any, Yup schema) => { isValid: bool, error: string }
export const isInputValid = (input, schema) => {
	try {
		schema.validateSync(input, { strict: true, abortEarly: true, recursive: true })
		const extraFields = typeof input !== 'object' || typeof schema.fields !== 'object'
			? [] : Object.keys(input).filter(field => !Object.keys(schema.fields).includes(field))
		return (extraFields.length > 0)
			? { isValid: false, error: `Extra fields present in input: ${extraFields.join(', ')}.`}
			: { isValid: true, error: '' }
	} catch (error) {
		return { isValid: false, error: error.message || String(error) } // was error.message
	}
}