import * as Yup from 'yup'
// This schema is for the Options used by TaskEditor
/**
 * Schema for an individual option object.
 *
 * @type {Yup.ObjectSchema<object>}
 */
export const optionSchema = Yup.object().shape({ name: Yup.string().required().max(20), listener: Yup.mixed().meta({ type: 'function' }).required(), algorithm: Yup.string().required(),})
/**
 * Schema for an array of option objects.
 *
 * @type {Yup.ArraySchema<Yup.ObjectSchema<object>>}
 */
export const taskEditorOptionsSchema = Yup.array().of(optionSchema)
/**
 * Fills the given object with default option values.
 *
 * @param {object} obj - The object to fill with default values.
 * @returns {object} - The object with default option values.
 */
export const fillWithOptionDefaults = obj => ({ name: '', listener: () => { }, algorithm: '', ...obj,})