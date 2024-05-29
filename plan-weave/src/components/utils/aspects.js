import { deleteDnDEvent } from "./helpers"

// --- Error Aspects
// TODO: For now we throw errors, later determine if we can do a better approach
export const supportedErrors = {
	'deleteDnDEvent': (dnd, indexRange) => {
		// dnd and indexRange are arrays, len(indexRange) = 2, len(dnd) > 0, dnd is an array of unique naturals
		if (!Array.isArray(dnd) || !Array.isArray(indexRange) || indexRange.length !== 2 || dnd.length === 0 || new Set(dnd).size !== dnd.length) {
			throw new TypeError(`Invalid input parameters in deleteDnDEvent.\ndnd = ${dnd}\nindexRange = ${indexRange}`)
		}
		const [startIndex, endIndex] = indexRange
		const invalidRange = startIndex < 0 || endIndex < startIndex || endIndex >= dnd.length
		if (invalidRange) throw new TypeError(`Invalid index range in deleteDnDEvent.\nRange = ${indexRange}`)

		return deleteDnDEvent(dnd, indexRange)
	}
}

/**
 * Wraps a function with error handling logic if it is a supported function.
 *
 * @function errorAspect
 * @param {Object} supportedFunctions - An object containing supported functions with their custom error handling logic.
 * @param {Function} fx - The function to be wrapped with error handling.
 * @returns {Function} A wrapped function with error handling if it is supported, otherwise the original function.
 * 
 * @example
 * // Define a supported function with custom error handling logic
 * const supportedFunctions = {
 *     deleteDnDEvent: (dnd, indexRange) => {
 *         if (!Array.isArray(dnd)) throw new TypeError('invalid input params')
 *         return deleteDnDEvent(dnd, indexRange)
 *     }
 * }
 * 
 * // Define the function to be wrapped
 * const deleteDnDEvent = (dnd, indexRange) => {
 *     const [startIndex, endIndex] = indexRange
 *     return ordinalSet(dnd.filter((_, i) => i < startIndex || i > endIndex))
 * }
 * 
 * // Usage example
 * const dnd = [1, 3, 2, 4, 5]
 * const indexRange = [0, 0]
 * const result = errorAspect(supportedFunctions, deleteDnDEvent)(dnd, indexRange)
 * console.log(result) // -> [1, 0, 2, 3]
 */
export const errorAspect = (supportedFunctions, fx) => {
	if (typeof fx !== 'function') return () => { }
	const fxName = fx.name
	return (supportedFunctions.hasOwnProperty(fxName))
		? supportedFunctions[fxName]
		: fx
}